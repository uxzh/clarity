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
      const comments = await RepliesDAO.getManyByField({
        field: "createdAt",
        value: { $exists: true },
        sort: "createdAt",
        page: parseInt(req.query.page) || 0,
        perPage: parseInt(req.query.perPage) || 20,
      });
      res.status(200).send(comments);
    } catch (e) {
      res.status(500).send({ error: "Error fetching comments" });
    }
  }

  static async getCreditCards(req, res) {
    try {
      const creditCards = await CardsDAO.getMany({
        page: 0,
        perPage: 30, // Adjust as needed
      });
      res.status(200).send(creditCards);
    } catch (e) {
      res.status(500).send({ error: "Error fetching credit cards" });
    }
  }
}

module.exports = AdminController;
