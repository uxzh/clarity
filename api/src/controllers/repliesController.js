const CardsDAO = require("../dao/cardsDAO");
const ReviewsDAO = require("../dao/reviewsDAO");
const RepliesDAO = require("../dao/repliesDAO");

class RepliesController {
  static async createReply(req, res) {
    try {
      const { reviewId, content } = req.body;

      const review = await ReviewsDAO.getOneById(reviewId);
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

      const result = await RepliesDAO.createOne(reply);
      if (!result || result.error) {
        return res.status(500).send({ error: "Error creating reply" });
      }

      res.status(201).send(reply);
    } catch (e) {
      res.status(500).send({ error: "Error creating reply" });
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

      const result = await RepliesDAO.updateOne({
        id,
        set: updatedReply
      });
      if (!result || result.error) {
        return res.status(500).send({ error: "Error updating reply" });
      }
      updatedReply._id = id;
      res.status(200).send(updatedReply);
    } catch (e) {
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
      res.status(500).send({ error: "Error deleting reply" });
    }
  }
}

module.exports = RepliesController;