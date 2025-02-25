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
            };
            const parentReply = await this.getOneById(parentReplyId);
            if (!parentReply || parentReply.error) {
                return { error: "Parent reply not found" };
            }
            let topLevelId = parentReplyId;
            if (parentReply.parentReplyId) {
                topLevelId = parentReply.parentReplyId;
            }
            const result = await replies.updateOne(
                { _id: new ObjectId(topLevelId) },
                { $push: { replies: newReply } }
            );
            if (result.modifiedCount === 0) {
                return { error: "Failed to add nested reply" };
            }
            return { insertedId: newReply._id };
        } catch (e) {
            console.error(`Unable to add nested reply: ${e}`);
            return { error: e };
        }
    }

    // Updated to handle nested replies
    static async getOneById(id) {
        try {
            const objectId = new ObjectId(id);
            // First, try to find as a top-level reply
            const topLevelReply = await replies.findOne({ _id: objectId });
            if (topLevelReply) {
                return topLevelReply;
            }
            // If not found, search within nested replies
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

    static async getManyByField({ field, value, sort = "createdAt", page = 0, perPage = 20 }) {
        try {
            return await replies.aggregate([
                { $match: { [field]: new ObjectId(value) } },
                {
                    $lookup: {
                        from: models.users,
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
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
                        "user.username": 1,
                        "user.avatar": 1
                    }
                },
                { $sort: { [sort]: -1 } },
                { $skip: perPage * page },
                { $limit: perPage }
            ]).toArray();
        } catch (e) {
            console.error(`Unable to get replies: ${e}`);
            return { error: e };
        }
    }

    // Updated to handle nested reply updates
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
            // Update nested reply
            return await replies.updateOne(
                { "replies._id": objectId },
                { $set: { "replies.$.content": set.content, "replies.$.updatedAt": set.updatedAt } }
            );
        } catch (e) {
            console.error(`Unable to update reply: ${e}`);
            return { error: e };
        }
    }

    // Updated to handle nested reply deletion
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
            session.endSession();
            return result;
        } catch (e) {
            console.error(`Unable to delete reply: ${e}`);
            session.endSession();
            return { error: e };
        }
    }
}

module.exports = RepliesDAO;
