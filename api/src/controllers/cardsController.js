const CardsDAO = require("../dao/cardsDAO");

class CardsController {
  static async getCards(req, res) {
    try {
      const cards = await CardsDAO.getCards();
      const { error } = cards;
      if (error) {
        return res.status(404).send(error)
      }
      res.status(200).send(cards);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
}

module.exports = CardsController;