const { ObjectId } = require("mongodb");
const CardsDAO = require("../dao/cardsDAO");
const ReviewsDAO = require("../dao/reviewsDAO");
const RepliesDAO = require("../dao/repliesDAO");
const LikesDAO = require("../dao/likesDAO");

class RepliesController {
    static async createReply(req, res) {
        try {
            const { reviewId, content, parentReplyId } = req.body;

            const review = await ReviewsDAO.getOneById(reviewId);
            if (!review || review.error) {
                return res.status(404).send({ error: "Review not found" });
            }

            if (parentReplyId) {
                const parentReply = await RepliesDAO.getOneById(parentReplyId);
                if (!parentReply || parentReply.error) {
                    return res.status(404).send({ error: "Parent reply not found" });
                }
            }

            const date = new Date();
            const reply = {
                reviewId,
                userId: req.user._id,
                content,
                parentReplyId: parentReplyId || null,
                createdAt: date,
                updatedAt: date,
            };

            let result;
            if (parentReplyId) {
                let topLevelId = parentReplyId;
                const parentReply = await RepliesDAO.getOneById(parentReplyId);
                if (parentReply.parentReplyId) {
                    topLevelId = parentReply.parentReplyId;
                }
                result = await RepliesDAO.addNestedReply(topLevelId, reply);
            } else {
                reply.replies = [];
                result = await RepliesDAO.createOne(reply);
            }

            if (!result || result.error) {
                return res.status(500).send({ error: "Error creating reply" });
            }

            const response = {
                _id: parentReplyId ? result.insertedId : result.insertedId,
                reviewId,
                content,
                parentReplyId: parentReplyId || null,
                user: {
                    _id: req.user._id,
                    username: req.user.username,
                    avatar: req.user.avatar
                },
                createdAt: date,
                updatedAt: date,
                likes: 0,
                dislikes: 0,
                ...(parentReplyId ? {} : { replies: [] })
            };

            res.status(201).send(response);
        } catch (e) {
            console.error(`Error in createReply: ${e}`);
            res.status(500).send({ error: "Error creating reply" });
        }
    }

    static async getRepliesByReview(req, res) {
        try {
            const { id } = req.params;
            const replies = await RepliesDAO.getManyByField({
                field: "reviewId",
                value: id,
                sort: "createdAt",
                page: parseInt(req.query.page) || 0,
                perPage: parseInt(req.query.perPage) || 20,
            });

            if (replies.error) {
                return res.status(500).send({ error: "Error fetching replies" });
            }

            const allReplyIds = [];
            const collectIds = (replyArray) => {
                if (!Array.isArray(replyArray)) return;
                replyArray.forEach(reply => {
                    allReplyIds.push(new ObjectId(reply._id));
                    if (reply.replies && reply.replies.length > 0) {
                        collectIds(reply.replies);
                    }
                });
            };
            collectIds(replies);

            const likeCounts = await LikesDAO.getManyCountByTargetIds(allReplyIds, 'reply');
            const likeMap = new Map(likeCounts.map(l => [l._id.toString(), {
                likes: l.isLike,
                dislikes: l.count - l.isLike
            }]));

            const addLikesToReplies = (replyArray) => {
                if (!Array.isArray(replyArray)) return [];
                return replyArray.map(reply => ({
                    ...reply,
                    likes: likeMap.get(reply._id.toString())?.likes || 0,
                    dislikes: likeMap.get(reply._id.toString())?.dislikes || 0,
                    replies: reply.replies ? addLikesToReplies(reply.replies) : []
                }));
            };

            const repliesWithLikes = addLikesToReplies(replies);
            res.status(200).send(repliesWithLikes);
        } catch (e) {
            console.error(`Error in getRepliesByReview: ${e}`);
            res.status(500).send({ error: "Error fetching replies" });
        }
    }

    static async updateReply(req, res) {
        try {
            const { id } = req.params;

            const reply = await RepliesDAO.getOneById(id);
            if (!reply || reply.error) {
                return res.status(404).send({ error: "Reply not found" });
            }

            const { content } = req.body;

            const updatedReply = {
                content,
                updatedAt: new Date(),
            };

            const result = await RepliesDAO.updateOne({ id, set: updatedReply });
            if (!result || result.error) {
                return res.status(500).send({ error: "Error updating reply" });
            }
            updatedReply._id = id;
            res.status(200).send(updatedReply);
        } catch (e) {
            console.error(`Error in updateReply: ${e}`);
            res.status(500).send({ error: "Error updating reply" });
        }
    }

    static async deleteReply(req, res) {
        try {
            const { id } = req.params;

            const reply = await RepliesDAO.getOneById(id);
            if (!reply || reply.error) {
                return res.status(404).send({ error: "Reply not found" });
            }

            const result = await RepliesDAO.deleteOne(id);
            if (!result || result.error) {
                return res.status(500).send({ error: "Error deleting reply" });
            }
            res.status(204).send();
        } catch (e) {
            console.error(`Error in deleteReply: ${e}`);
            res.status(500).send({ error: "Error deleting reply" });
        }
    }

    static async likeReply(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            const reply = await RepliesDAO.getOneById(id);
            if (!reply || reply.error) {
                return res.status(404).send({ error: "Reply not found" });
            }

            const existingLike = await LikesDAO.getLikeByUserAndTarget(userId, id);
            if (existingLike && !existingLike.error) {
                if (existingLike.isLike) {
                    await LikesDAO.deleteLikeByUserAndTarget(userId, id);
                } else {
                    await LikesDAO.updateOne({ targetId: id, targetType: "reply", userId, isLike: true });
                }
            } else {
                await LikesDAO.createOne({ targetId: id, targetType: "reply", userId, isLike: true });
            }

            const likeCounts = await LikesDAO.getManyCountByTargetIds([new ObjectId(id)], 'reply');
            const counts = likeCounts[0] || { isLike: 0, count: 0 };

            res.status(200).send({
                _id: id,
                likes: counts.isLike,
                dislikes: counts.count - counts.isLike
            });
        } catch (e) {
            console.error(`Error in likeReply: ${e}`);
            res.status(500).send({ error: "Error liking reply" });
        }
    }

    static async dislikeReply(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            const reply = await RepliesDAO.getOneById(id);
            if (!reply || reply.error) {
                return res.status(404).send({ error: "Reply not found" });
            }

            const existingLike = await LikesDAO.getLikeByUserAndTarget(userId, id);
            if (existingLike && !existingLike.error) {
                if (!existingLike.isLike) {
                    await LikesDAO.deleteLikeByUserAndTarget(userId, id);
                } else {
                    await LikesDAO.updateOne({ targetId: id, targetType: "reply", userId, isLike: false });
                }
            } else {
                await LikesDAO.createOne({ targetId: id, targetType: "reply", userId, isLike: false });
            }

            const likeCounts = await LikesDAO.getManyCountByTargetIds([new ObjectId(id)], 'reply');
            const counts = likeCounts[0] || { isLike: 0, count: 0 };

            res.status(200).send({
                _id: id,
                likes: counts.isLike,
                dislikes: counts.count - counts.isLike
            });
        } catch (e) {
            console.error(`Error in dislikeReply: ${e}`);
            res.status(500).send({ error: "Error disliking reply" });
        }
    }
}

module.exports = RepliesController;
