const bcrypt = require('bcrypt');
const { validate } = require('deep-email-validator');

const UsersDAO = require('../dao/usersDAO');
const jwt = require('../lib/jwt');
const verifyGoogleToken = require('../lib/verifyGoogleToken');
const { MailSender } = require('../lib/mail/mailSender');
const { MAIL_TEMPLATES } = require('../lib/mail/templates');

class AuthController {
  static async signup(req, res) {
    try {
      const { email, password, username } = req.body;
      
      let existingUser = await UsersDAO.getOneByField("email", email);
      if (existingUser) {
        return res.status(400).send({ error: 'User already exists' });
      }

      existingUser = await UsersDAO.getOneByField("username", username);
      if (existingUser) {
        return res.status(400).send({ error: 'Username already in use' });
      }

      // deep email validation
      const validationResult = await validate(email);
      if (!validationResult.valid) {
        return res.status(400).send({ error: 'Invalid email' });
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

      const { error } = await UsersDAO.createOne(user);
      if (error) {
        return res.status(500).send({ error: "Error signing up" });
      }
      delete user.password;
      delete user.role;

      const token = jwt.sign({ _id: user._id });
      user.token = token;

      const verificationToken = jwt.sign({ email });
      const message = MAIL_TEMPLATES.confirmEmail(`${process.env.HOST}:${process.env.PORT}/api/v1/auth/verify-email/${verificationToken}`);

      try {
        await MailSender.send(email, message);
      } catch (error) {
        console.error(error);
      }

      res.status(201).send(user);
    } catch (e) {
      res.status(500).send({ error: "Error signing up" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UsersDAO.getOneByField("email", email);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(404).send({ error: 'User not found' });
      }

      delete user.password;
      delete user.role;
      delete user.previousUsernames;
      const token = jwt.sign({ _id: user._id });
      user.token = token;

      await UsersDAO.updateOne(user._id, { lastLogin: new Date() });

      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ error: "Error logging in" });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      try {
        const decodedValue = jwt.verify(token);
        const user = await UsersDAO.getOneByField("email", decodedValue.email);
        if (!user || user.error) {
          return res.status(404).send({ error: 'User not found' });
        }
        if (user.emailVerified) {
          return res.status(400).send({ error: 'Email already verified' });
        }
        
        await UsersDAO.updateOne({
          id: user._id,
          set: { emailVerified: true },
        });
        return res.status(200).send({ message: 'Email verified' });
      } catch(error) {
        return res.status(401).send('User is not authorized to access this endpoint')
      }
    } catch (e) {
      res.status(500).send({ error: "Error verifying email" });
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
      let existingUser = await UsersDAO.getOneByField("email", profile?.email);
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

      const { error } = await UsersDAO.createOne(user);
      if (error) {
        return res.status(500).send({ error: "Error signing up" });
      }

      const token = jwt.sign({ _id: user._id });
      user.token = token;
      delete user.role;
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

      const user = await UsersDAO.getOneByField("email", email);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      if (user.loginMethod !== 'google') {
        return res.status(404).send({ error: 'User not found' });
      }

      const token = jwt.sign({ _id: user._id });
      user.token = token;
      delete user.previousUsernames;

      await UsersDAO.updateOne(user._id, { lastLogin: new Date() });

      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ error: "Error logging in" });
    }
  }
}

module.exports = AuthController;