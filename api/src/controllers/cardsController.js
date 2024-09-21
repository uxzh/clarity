const { ObjectId } = require("mongodb");
const CardsDAO = require("../dao/cardsDAO");
const ReviewsDAO = require("../dao/reviewsDAO");

class CardsController {
  static async getCards(req, res) {
    try {
      const { filters, page, perPage, search } = req.query;
      const cards = await CardsDAO.getMany({
        filters,
        page: page && parseInt(page),
        perPage: perPage && parseInt(perPage),
        searchTerm: search,
      });
      const { error } = cards;
      if (error) {
        return res.status(404).send(error)
      }
      res.status(200).send(cards);
    } catch (e) {
      console.error(e)
      res.status(500).send({ error: "Error fetching cards" });
    }
  }

  static async getReviews(req, res) {
    try {
      const { id } = req.params;
      const reviews = await ReviewsDAO.getManyByField({
        field: "cardId",
        value: new ObjectId(id),
        sort: "createdAt",
      });
      const { error } = reviews;
      if (error) {
        return res.status(404).send(error)
      }
      res.status(200).send(reviews);
    } catch (e) {
      console.error(e)
      res.status(500).send({ error: "Error fetching reviews" });
    }
  }

  static async getTopCards(req, res) {
    try {
      const cards = await CardsDAO.getTopCards()
      res.status(200).send(cards);
    } catch (e) {
      console.error(e)
      res.status(500).send({ error: "Error fetching top cards" });
    } 
  }
}

module.exports = CardsController;