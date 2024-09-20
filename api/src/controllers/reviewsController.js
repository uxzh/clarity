const CardsDAO = require("../dao/cardsDAO");
const LikesDAO = require("../dao/likesDAO");
const ReviewsDAO = require("../dao/reviewsDAO");

class ReviewsController {
  static async getReview(req, res) {
    try {
      const { id } = req.params
      // const review = await ReviewsDAO.getOneByIdWithLikes(id)
      const review = await ReviewsDAO.getOneById(id)
      if (!review || review.error) {
        return res.status(404).send({ error: "Review not found" });
      }
      return res.status(200).send(review)
    } catch(e) {
      console.error(e)
      res.status(500).send({ error: "Error getting review" });
    }
  }

  static async createReview(req, res) {
    try {
      const { cardId, rating, title, content } = req.body;

      const card = await CardsDAO.getOneById(cardId);
      if (!card || card.error) {
        return res.status(404).send({ error: "Card not found" });
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
      };

      const result = await ReviewsDAO.createOne(review);
      if (!result || result.error) {
        return res.status(500).send({ error: "Error creating review" });
      }

      res.status(201).send(review);
    } catch (e) {
      res.status(500).send({ error: "Error creating review" });
    }
  }

  static async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const review = await ReviewsDAO.getOneById(id);
      res.status(204).send();

    } catch (e) {
      res.status(500).send({ error: "Error deleting review" });
    }
  }

  static async likeReview(req, res) {
    try {
      const { isLike } = req.body;
      const { id: targetId } = req.params;

      const review = await ReviewsDAO.getOneById(targetId);
      if (!review || review.error) {
        return res.status(404).send({ error: "Review not found" });
      }

      const existingLike = await LikesDAO.getLikeByUserAndTarget(req.user._id, targetId);
      if (existingLike && !existingLike.error) {
        return res.status(400).send({ error: "Like already exists" });
      }

      const like = {
        targetId,
        targetType: "review",
        userId: req.user._id,
        isLike,
      };

      const result = await LikesDAO.createOne(like);
      if (!result || result.error) {
        return res.status(500).send({ error: "Error creating like" });
      }

      res.status(201).send(like);
    } catch (e) {
      res.status(500).send({ error: "Error creating like" });
    }
  }

  static async deleteLike(req, res) {
    try {
      const { id: targetId } = req.params;

      const result = await LikesDAO.deleteLikeByUserAndTarget(req.user._id, targetId);
      if (!result || result.error) {
        return res.status(500).send({ error: "Error deleting like" });
      }
      if (result.deletedCount === 0) {
        return res.status(404).send({ error: "Like not found" });
      }

      res.status(204).send();
    } catch (e) {
      res.status(500).send({ error: "Error deleting like" });
    }
  }
}

module.exports = ReviewsController;