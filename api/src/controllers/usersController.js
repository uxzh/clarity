const bcrypt = require('bcrypt');

const UsersDAO = require("../dao/usersDAO");

class UsersController {
  static async checkUsernameExists(req, res) {
    try {
      const { username } = req.body;
      const user = await UsersDAO.getOneByField("username", username);
      if (user && !user.error) {
        return res.status(200).send({ exists: true });
      }

      res.status(200).send({ exists: false });
    } catch (e) {
      res.status(500).send({ error: "Error checking username" });
    }
  }

  static async updateUser(req, res) {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).send({ error: "No fields to update" });
      }
      let user;
      if (req.user.isAdmin) {
        user = await UsersDAO.getOneById(req.params.id);
        if (!user || user.error) {
          return res.status(404).send({ error: "User not found" });
        }
      } else {
        user = req.user;
      }
      
      const { username, password, confirmPassword, avatar } = req.body;
      const setData = {}
      const pushData = {}
      
      // username
      if (username && user.username !== username) {
        const existingUser = await UsersDAO.getOneByField("username", username);
        if (existingUser && !existingUser.error) {
          return res.status(400).send({ error: "Username already exists" });
        }
        setData.username = username;
        pushData.previousUsernames = {
          username: user.username,
          updatedAt: new Date
        }
      }

      // avatar
      if (avatar && req.user.avatar !== avatar) {
        setData.avatar = avatar;
      }

      // password
      if (password && confirmPassword) {
        if (password !== confirmPassword) {
          return res.status(400).send({ error: "Passwords do not match" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if (hashedPassword !== user.password) {
          setData.password = hashedPassword;
        }
      }

      if (Object.keys(setData).length === 0) {
        return res.status(400).send({ error: "No fields to update" });
      }
      await UsersDAO.updateOne({
        id: req.user._id,
        set: setData,
        push: pushData,
      });
      res.status(200).send({ message: "User updated" });
    } catch (e) {
      res.status(500).send({ error: "Error updating user" });
    }
  }

  static async deleteUser(req, res) {
    try {
      const result = await UsersDAO.deleteOne(req.params.id);
      if (!result || result.error) {
        return res.status(500).send({ error: "Error deleting user" });
      }
      if (result.deletedCount === 0) {
        return res.status(404).send({ error: "User not found" });
      }
      res.status(204).send();
    } catch (e) {
      res.status(500).send({ error: "Error deleting user" });
    }
  }
}

module.exports = UsersController;