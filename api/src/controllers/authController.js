const bcrypt = require('bcrypt');

const UsersDAO = require('../dao/usersDAO');
const jwt = require('../lib/jwt');
const verifyGoogleToken = require('../lib/verifyGoogleToken');

class AuthController {
  static async signup(req, res) {
    try {
      const { email, password, username } = req.body;
      
      let existingUser = await UsersDAO.getUserByField("email", email);
      if (existingUser) {
        return res.status(400).send({ error: 'User already exists' });
      }

      existingUser = await UsersDAO.getUserByField("username", username);
      if (existingUser) {
        return res.status(400).send({ error: 'Username already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const createdAt = new Date();
      const user = {
        email,
        password: hashedPassword,
        username,
        role: 'user',
        avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${username}`,
        loginMethod: 'email',
        emailVerified: false,
        isBlocked: false,
        createdAt: createdAt,
        updatedAt: createdAt,
        lastLogin: createdAt,
      };

      const { error } = await UsersDAO.createUser(user);
      if (error) {
        return res.status(500).send({ error: "Error signing up" });
      }
      delete user.password;

      const token = jwt.sign({ _id: user._id });
      user.token = token;

      // todo: send email verification
      res.status(201).send(user);
    } catch (e) {
      res.status(500).send({ error: "Error signing up" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UsersDAO.getUserByField("email", email);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(404).send({ error: 'User not found' });
      }

      delete user.password;
      const token = jwt.sign({ _id: user._id });
      user.token = token;

      await UsersDAO.updateUserFields(user._id, { lastLogin: new Date() });

      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ error: "Error logging in" });
    }
  }

  static async signupGoogle(req, res) {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).send({ error: 'Invalid credential' });
      }
      const verificationResponse = await verifyGoogleToken(credential);
      if (verificationResponse.error) {
        return res.status(400).send({ error: verificationResponse.error });
      }

      const profile = verificationResponse?.payload;
      let existingUser = await UsersDAO.getUserByField("email", profile?.email);
      if (existingUser) {
        return res.status(400).send({ error: 'User already exists' });
      }

      const username = email.split('@')[0];
      // todo: ensure username is unique

      const createdAt = new Date();
      const user = {
        email,
        username,
        role: 'user',
        avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${username}`,
        loginMethod: 'google',
        emailVerified: true,
        isBlocked: false,
        createdAt: createdAt,
        updatedAt: createdAt,
        lastLogin: createdAt,
      };

      const { error } = await UsersDAO.createUser(user);
      if (error) {
        return res.status(500).send({ error: "Error signing up" });
      }

      const token = jwt.sign({ _id: user._id });
      user.token = token;
      res.status(201).send(user);
    } catch (e) {
      res.status(500).send({ error: "Error signing up" });
    }
  }

  static async loginGoogle(req, res) {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).send({ error: 'Invalid credential' });
      }
      const verificationResponse = await verifyGoogleToken(credential);

      if (verificationResponse.error) {
        return res.status(400).send({ error: verificationResponse.error });
      }

      const profile = verificationResponse?.payload;
      const { email } = profile;

      const user = await UsersDAO.getUserByField("email", email);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      if (user.loginMethod !== 'google') {
        return res.status(404).send({ error: 'User not found' });
      }

      const token = jwt.sign({ _id: user._id });
      user.token = token;

      await UsersDAO.updateUserFields(user._id, { lastLogin: new Date() });

      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ error: "Error logging in" });
    }
  }
}

module.exports = AuthController;