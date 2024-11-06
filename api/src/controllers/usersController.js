const bcrypt = require('bcrypt');

const UsersDAO = require("../dao/usersDAO");

class UsersController {
  static async checkUsernameAvailable(req, res) {
    try {
      const { username } = req.body;
      const user = await UsersDAO.getOneByField("username", username);
      if (user && !user.error) {
        return res.status(200).send({ isAvailable: false });
      }

      res.status(200).send({ isAvailable: true });
    } catch (e) {
      res.status(500).send({ error: "Error checking username" });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await UsersDAO.getMany({
        page: parseInt(req.query.page) || 0,
        perPage: parseInt(req.query.perPage) || 10,
      })
      if (!users || users.error) {
        return res.status(500).send({ error: "Error fetching users" });
      }
      users.forEach(user => {
        delete user.password;
      });
      res.status(200).send(users);
    } catch (e) {
      res.status(500).send({ error: "Error fetching users" });
    }
  }

  static async getUser(req, res) {
    try {
      const { id } = req.params;
      if (req.user.id === id) {
        return res.status(200).send(req.user);
      }
      const user = await UsersDAO.getOneById(id);
      if (!user || user.error) {
        return res.status(404).send({ error: "User not found" });
      }
      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ error: "Error fetching user" });
    }
  }


  static async updateUser(req, res) {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).send({ error: "No fields to update" });
      }
      let user;
      const { id } = req.params;
      if (req.user.isAdmin) {
        user = await UsersDAO.getOneById(id);
        if (!user || user.error) {
          return res.status(404).send({ error: "User not found" });
        }
      } else {
        user = req.user;
      }
      
      const { username, password, confirmPassword, email } = req.body;
      const fields = ["avatar"];
      if (req.user.isAdmin) {
        fields.push(...["role", "emailVerified", "isBlocked"]);
      }

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

      if (req.user.isAdmin && email && user.email !== email) {
        const existingUser = await UsersDAO.getOneByField("email", req.body.email);
        if (existingUser && !existingUser.error) {
          return res.status(400).send({ error: "Email already exists" });
        }
        setData.email = req.body.email;
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

      fields.forEach(field => {
        if (Object.keys(req.body).includes(field) && user[field] !== req.body[field]) {
          setData[field] = req.body[field];
        }
      });

      if (Object.keys(setData).length === 0) {
        return res.status(400).send({ error: "No fields to update" });
      }
      setData.updatedAt = new Date();

      await UsersDAO.updateOne({
        id: user._id,
        set: setData,
        push: pushData,
      });
      const updatedUser = { 
        ...user,
        ...setData,
        previousUsernames: user.previousUsernames,
      };
      if (pushData.previousUsernames) {
        updatedUser.previousUsernames.push(pushData.previousUsernames);
      }
      res.status(200).send(updatedUser);
    } catch (e) {
      console.error(e)
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