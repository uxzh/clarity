const UsersDAO = require("../dao/usersDAO");
const RepliesDAO = require("../dao/repliesDAO");
const CardsDAO = require("../dao/cardsDAO");

class AdminController {
  static async getUsers(req, res) {
    try {
      const users = await UsersDAO.getAll();
      res.status(200).send(users);
    } catch (e) {
      res.status(500).send({ error: "Error fetching users" });
    }
  }

  static async getComments(req, res) {
    try {
      const comments = await RepliesDAO.getAll();
      res.status(200).send(comments);
    } catch (e) {
      res.status(500).send({ error: "Error fetching comments" });
    }
  }

  static async getCreditCards(req, res) {
    try {
      const creditCards = await CardsDAO.getAll();
      res.status(200).send(creditCards);
    } catch (e) {
      res.status(500).send({ error: "Error fetching credit cards" });
    }
  }
}

module.exports = AdminController;
