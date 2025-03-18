const { ObjectId } = require("mongodb");
const { models } = require("../lib/models");
const { getMongoClient, getDB } = require("../lib/connectToDB");

let replies;

class RepliesDAO {
    static async injectDB(db) {
        if (replies) return;
        try {
            replies = await db.collection(models.replies);
        } catch (e) {
            console.error(`Unable to establish collection handles in RepliesDAO: ${e}`);
        }
    }

    static async createOne(replyData) {
        try {
            return await replies.insertOne({
                ...replyData,
                reviewId: new ObjectId(replyData.reviewId),
                userId: new ObjectId(replyData.userId),
                replies: []
            });
        } catch (e) {
            console.error(`Unable to create reply: ${e}`);
            return { error: e };
        }
    }

    static async addNestedReply(parentReplyId, replyData) {
        try {
            const newReply = {
                ...replyData,
                _id: new ObjectId(),
                reviewId: new ObjectId(replyData.reviewId),
                userId: new ObjectId(replyData.userId),
                replies: [] // Add empty replies array for nested replies
            };
            const parentReply = await this.getOneById(parentReplyId);
            if (!parentReply || parentReply.error) {
                return { error: "Parent reply not found" };
            }

            let result;
            // Check if this is a top-level reply or a nested reply
            if (!parentReply.parentReplyId) {
                // If parent is a top-level reply, add directly to its replies array
                result = await replies.updateOne(
                    { _id: new ObjectId(parentReplyId) },
                    { $push: { replies: newReply } }
                );
            } else {
                // If parent is a nested reply, find the top-level reply that contains it
                const topLevelReply = await replies.findOne(
                    { "replies._id": new ObjectId(parentReplyId) }
                );

                if (!topLevelReply) {
                    return { error: "Top level reply not found" };
                }

                // Add the new reply to the top-level reply's replies array
                result = await replies.updateOne(
                    { _id: topLevelReply._id },
                    { $push: { replies: newReply } }
                );
            }
            if (result.modifiedCount === 0) {
                return { error: "Failed to add nested reply" };
            }
            return { insertedId: newReply._id };
        } catch (e) {
            console.error(`Unable to add nested reply: ${e}`);
            return { error: e };
        }
    }

    static async getOneById(id) {
        try {
            const objectId = new ObjectId(id);
            const topLevelReply = await replies.findOne({ _id: objectId });
            if (topLevelReply) {
                return topLevelReply;
            }
            const result = await replies.findOne(
                { "replies._id": objectId },
                { projection: { "replies.$": 1 } }
            );
            if (result && result.replies && result.replies.length > 0) {
                return result.replies[0];
            }
            return null;
        } catch (e) {
            console.error(`Unable to get reply: ${e}`);
            return { error: e };
        }
    }

    static async getManyByField({ field, value, sort = "createdAt", page = 0, perPage = 1000 }) {
        try {
            // First, get all top-level replies with their user info
            const pipeline = [
                { $match: { [field]: new ObjectId(value) } },
                {
                    $lookup: {
                        from: models.users,
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        reviewId: 1,
                        userId: 1,
                        content: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        parentReplyId: 1,
                        replies: 1,
                        "user._id": 1,
                        "user.username": 1,
                        "user.avatar": 1
                    }
                },
                { $sort: { [sort]: -1 } },
                { $skip: perPage * page },
                { $limit: perPage }
            ];

            const topLevelReplies = await replies.aggregate(pipeline).toArray();

            // Function to recursively add user info to nested replies
            const addUserInfoToReplies = async (repliesArray) => {
                if (!repliesArray || repliesArray.length === 0) return [];

                const result = [];

                for (const reply of repliesArray) {
                    // If reply has nested replies, process them recursively
                    if (reply.replies && reply.replies.length > 0) {
                        // Get user info for each nested reply
                        const nestedRepliesWithUsers = [];

                        for (const nestedReply of reply.replies) {
                            // Fetch user info for this nested reply
                            const userInfo = await getDB().collection(models.users).findOne(
                                { _id: new ObjectId(nestedReply.userId) },
                                { projection: { _id: 1, username: 1, avatar: 1 } }
                            );

                            // Add user info to the nested reply
                            const replyWithUser = {
                                ...nestedReply,
                                user: userInfo || {}
                            };

                            // Process any deeper nested replies
                            if (nestedReply.replies && nestedReply.replies.length > 0) {
                                replyWithUser.replies = await addUserInfoToReplies(nestedReply.replies);
                            }

                            nestedRepliesWithUsers.push(replyWithUser);
                        }

                        result.push({
                            ...reply,
                            replies: nestedRepliesWithUsers
                        });
                    } else {
                        result.push(reply);
                    }
                }

                return result;
            };

            // Process all top-level replies to add user info to their nested replies
            return await addUserInfoToReplies(topLevelReplies);
        } catch (e) {
            console.error(`Unable to get replies: ${e}`);
            return { error: e };
        }
    }

    static async updateOne({ id, set }) {
        try {
            const objectId = new ObjectId(id);
            const topLevelReply = await replies.findOne({ _id: objectId });
            if (topLevelReply) {
                return await replies.updateOne(
                    { _id: objectId },
                    { $set: set }
                );
            }
            return await replies.updateOne(
                { "replies._id": objectId },
                { $set: { "replies.$.content": set.content, "replies.$.updatedAt": set.updatedAt } }
            );
        } catch (e) {
            console.error(`Unable to update reply: ${e}`);
            return { error: e };
        }
    }

    static async deleteOne(id) {
        try {
            const client = getMongoClient();
            const db = getDB();
            const session = client.startSession();
            const transactionOptions = {
                readPreference: "primary",
                readConcern: { level: "local" },
                writeConcern: { w: "majority" }
            };
            let result;
            await session.withTransaction(async () => {
                const likes = db.collection(models.likes);
                await likes.deleteMany({ targetId: new ObjectId(id) }, { session });

                const topLevelReply = await replies.findOne({ _id: new ObjectId(id) });
                if (topLevelReply) {
                    result = await replies.deleteOne({ _id: new ObjectId(id) }, { session });
                } else {
                    result = await replies.updateOne(
                        { "replies._id": new ObjectId(id) },
                        { $pull: { replies: { _id: new ObjectId(id) } } },
                        { session }
                    );
                }
            }, transactionOptions);
            await session.endSession();
            return result;
        } catch (e) {
            console.error(`Unable to delete reply: ${e}`);
            await session.endSession();
            return { error: e };
        }
    }
}

module.exports = RepliesDAO;
