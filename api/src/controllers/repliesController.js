const CardsDAO = require("../dao/cardsDAO");
const ReviewsDAO = require("../dao/reviewsDAO");
const RepliesDAO = require("../dao/repliesDAO");

class RepliesController {
  static async createReply(req, res) {
    try {
      const { reviewId, content } = req.body;

      const review = await ReviewsDAO.getReviewById(reviewId);
      if (!review || review.error) {
        return res.status(404).send({ error: "Review not found" });
      }

      const date = new Date();

      const reply = {
        reviewId,
        userId: req.user._id,
        content,
        createdAt: date,
        updatedAt: date,
      };

      const result = await RepliesDAO.createReply(reply);
      if (!result || result.error) {
        return res.status(500).send({ error: "Error creating reply" });
      }

      res.status(201).send(reply);
    } catch (e) {
      res.status(500).send({ error: "Error creating reply" });
    }
  }
}

module.exports = RepliesController;