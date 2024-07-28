const UsersDAO = require("../dao/usersDAO");

class UsersController {
  static async checkUsernameExists(req, res) {
    try {
      const { username } = req.body;
      const user = await UsersDAO.getUserByField("username", username);
      if (user && !user.error) {
        return res.status(200).send({ exists: true });
      }
      res.status(200).send({ exists: false });
    } catch (e) {
      res.status(500).send({ error: "Error checking username" });
    }
  }
}

module.exports = UsersController;