const CardsDAO = require("../dao/cardsDAO");
const LikesDAO = require("../dao/likesDAO");
const RepliesDAO = require("../dao/repliesDAO");
const ReviewsDAO = require("../dao/reviewsDAO");

class ReviewsController {
    static async getReviews(req, res) {
        try {
            const reviews = await ReviewsDAO.getMany({
                page: parseInt(req.query.page) || 0,
                perPage: parseInt(req.query.perPage) || 20,
            });
            res.status(200).send(reviews);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error fetching reviews"});
        }
    }

    static async getReview(req, res) {
        try {
            const {id} = req.params
            const review = await ReviewsDAO.getOneById(id)
            if (!review || review.error) {
                return res.status(404).send({error: "Review not found"});
            }
            return res.status(200).send(review)
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error getting review"});
        }
    }

    static async createReview(req, res) {
        try {
            const {
                cardId, rating, title, content,
                isAdminReview, username // for admin review
            } = req.body;

            if (isAdminReview && !req.user.isAdmin) {
                return res.status(403).send({error: "User is not authorized to create admin review"});
            }

            const card = await CardsDAO.getOneById(cardId);
            if (!card || card.error) {
                return res.status(404).send({error: "Card not found"});
            }

            if (!isAdminReview) {
                const existingReview = await ReviewsDAO.getOneByCardAndUser(cardId, req.user._id);
                if (existingReview && !existingReview.error) {
                    return res.status(400).send({error: "Review already exists"});
                }
            }

            const date = new Date();

            const review = {
                cardId,
                userId: req.user._id,
                rating,
                title,
                content,
                createdAt: date,
                updatedAt: date,
                isHidden: false,
            };
            if (isAdminReview) {
                review.isAdminReview = true;
                review.displayedUser = {
                    username,
                    avatar: `https://api.dicebear.com/6.x/notionists/svg?seed=${username}`
                };
            }

            const result = await ReviewsDAO.createOne(review);
            if (!result || result.error) {
                return res.status(500).send({error: "Error creating review"});
            }
            review._id = result.insertedId
            res.status(201).send(review);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error creating review"});
        }
    }

    static async updateReview(req, res) {
        try {
            const {id} = req.params;

            const review = await ReviewsDAO.getOneById(id);
            if (!review || review.error) {
                return res.status(404).send({error: "Review not found"});
            }

            const fields = ["rating", "title", "content", "isHidden"];
            const data = {}
            fields.forEach(field => {
                if (Object.keys(req.body).includes(field)) {
                    data[field] = req.body[field];
                }
            });
            data.updatedAt = new Date();
            if (req.user.isAdmin && review.isAdminReview && req.body.username) {
                data.isAdminReview = true;
                data.displayedUser = {
                    username: req.body.username,
                    avatar: `https://api.dicebear.com/6.x/notionists/svg?seed=${req.body.username}`
                };
            }

            const result = await ReviewsDAO.updateOne({
                id,
                set: data,
            });
            if (!result || result.error) {
                return res.status(500).send({error: "Error updating review"});
            }
            res.status(200).send({_id: id, ...data});
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error updating review"});
        }
    }

    static async deleteReview(req, res) {
        try {
            const {id} = req.params;

            const review = await ReviewsDAO.getOneById(id);
            if (!review || review.error) {
                return res.status(404).send({error: "Review not found"});
            }

            const result = await ReviewsDAO.deleteOne(id);
            if (!result || result.error) {
                return res.status(500).send({error: "Error deleting review"});
            }
            if (result.deletedCount === 0) {
                return res.status(404).send({error: "Review not found"});
            }

            res.status(204).send();
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error deleting review"});
        }
    }

    // likes
    static async likeReview(req, res) {
        try {
            const {isLike} = req.body;
            const {id: targetId} = req.params;

            const review = await ReviewsDAO.getOneById(targetId);
            if (!review || review.error) {
                return res.status(404).send({error: "Review not found"});
            }

            const existingLike = await LikesDAO.getLikeByUserAndTarget(req.user._id, targetId);
            if (existingLike && !existingLike.error) {
                return res.status(400).send({error: "Like already exists"});
            }

            const like = {
                targetId,
                targetType: "review",
                userId: req.user._id,
                isLike,
            };

            const result = await LikesDAO.createOne(like);
            if (!result || result.error) {
                return res.status(500).send({error: "Error creating like"});
            }

            res.status(201).send(like);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error creating like"});
        }
    }

    static async updateReviewLike(req, res) {
        try {
            const {isLike} = req.body;
            const {id: targetId} = req.params;

            const review = await ReviewsDAO.getOneById(targetId);
            if (!review || review.error) {
                return res.status(404).send({error: "Review not found"});
            }

            const existingLike = await LikesDAO.getLikeByUserAndTarget(req.user._id, targetId);
            if (!existingLike || existingLike.error) {
                return res.status(404).send({error: "Like not found"});
            }

            if (existingLike.isLike === isLike) {
                return res.status(400).send({error: "Like already set"});
            }

            const like = {
                targetId,
                targetType: "review",
                userId: req.user._id,
                isLike,
            };

            const result = await LikesDAO.updateOne(like);
            if (!result || result.error) {
                return res.status(500).send({error: "Error updating like"});
            }

            res.status(200).send(like);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error updating like"});
        }
    }

    static async deleteLike(req, res) {
        try {
            const {id: targetId} = req.params;

            const result = await LikesDAO.deleteLikeByUserAndTarget(req.user._id, targetId);
            if (!result || result.error) {
                return res.status(500).send({error: "Error deleting like"});
            }
            if (result.deletedCount === 0) {
                return res.status(404).send({error: "Like not found"});
            }

            res.status(204).send();
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error deleting like"});
        }
    }
}

module.exports = ReviewsController;
