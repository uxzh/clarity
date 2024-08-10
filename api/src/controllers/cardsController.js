const CardsDAO = require("../dao/cardsDAO");

class CardsController {
  static async getCards(req, res) {
    try {
      const { filters, page, perPage } = req.query;
      const cards = await CardsDAO.getMany({
        filters,
        page: parseInt(page),
        perPage: parseInt(perPage),
      });
      const { error } = cards;
      if (error) {
        return res.status(404).send(error)
      }
      res.status(200).send(cards);
    } catch (e) {
      res.status(500).send({ error: "Error fetching cards" });
    }
  }
}

module.exports = CardsController;