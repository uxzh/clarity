const UsersDAO = require("../dao/usersDAO");

class Permissions {
  static isAuthenticated(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).send('User is not authorized to access this endpoint');
      }
      return next();
    } catch (error) {
      return res.status(500).send({ error });
    }
  }

  static isOwner(req, res, next) {
    try {
      const id = req.params.id;
      if (req.user._id !== id) {
        return res.status(403).send('User is not authorized to access this endpoint');
      }
      return next();
    } catch (error) {
      return res.status(500).send({ error });
    }
  }

  static async _injectUserData(req, res, next) {
    try {
      const user = await UsersDAO.getUserById(req.user._id);
      if (user && !user.error) {
        const isAdmin = user.role === 'admin';
        delete user.role;
        req.user = { ...req.user, ...user, isAdmin };
      }
      return next();
    } catch (error) {
      return res.status(500).send({ error });
    }
  }

  static async isAdmin(req, res, next) {
    return [
      Permissions.isAuthenticated,
      Permissions._injectUserData,
      () => {
      try {
        if (!req.user.isAdmin) {
          return res.status(403).send('User is not authorized to access this endpoint');
        }
        return next();
      } catch (error) {
        return res.status(500).send({ error });
      }
    }];
  }

  static isOwnerOrAdmin = [
    Permissions.isAuthenticated,
    Permissions._injectUserData,
    (req, res, next) => {
      try {
        const id = req.params.id;
        if (req.user._id !== id && !req.user.isAdmin) {
          return res.status(403).send('User is not authorized to access this endpoint');
        }
        return next();
      } catch (error) {
        return res.status(500).send({ error });
      }
    }
  ];
}

module.exports = Permissions;