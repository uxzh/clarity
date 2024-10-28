const UsersDAO = require("../dao/usersDAO");
const { models } = require("../lib/models");
const { modelToDAO } = require("../lib/modelsToDAO");

class Permissions {
  static async _getOwner(id, model) {
    const fieldName = model === models.users ? '_id' : 'userId';
    const dao = modelToDAO[model];
    const item = await dao.getOneById(id);
    if (!item || item.error) {
      return null;
    }
    return await UsersDAO.getOneById(item[fieldName]);
  }

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

  static async isOwner(model) {
    return [
      Permissions.isAuthenticated,
      async (req, res, next) => {
        try {
          const id = req.params.id;
          if (model === models.users) {
            if (req.user._id !== id) {
              return res.status(403).send('User is not authorized to access this endpoint');
            }
            return next();
          }

          const owner = await Permissions._getOwner(id, model);
          if (!owner || owner.error) {
            return res.status(404).send({ error: 'User not found' });
          }
          if (req.user._id !== owner._id) {
            return res.status(403).send('User is not authorized to access this endpoint');
          }
          return next();
        } catch (error) {
          return res.status(500).send({ error });
        }
      }
    ];
  }

  static isAdmin = [
    Permissions.isAuthenticated,
    () => {
      try {
        if (!req.user.isAdmin) {
          return res.status(403).send('User is not authorized to access this endpoint');
        }
        return next();
      } catch (error) {
        return res.status(500).send({ error });
      }
    }
  ]

  static isOwnerOrAdmin(model) { 
    return [
      Permissions.isAuthenticated,
      async (req, res, next) => {
        try {
          if (req.user.isAdmin) {
            return next();
          }

          const id = req.params.id;
          if (model === models.users && req.user._id === id) {
            return next();
          }
          
          const owner = await Permissions._getOwner(id, model);
          if (!owner || owner.error) {
            return res.status(404).send({ error: 'User not found' });
          }

          if (req.user._id !== owner._id) {
            return res.status(403).send('User is not authorized to access this endpoint');
          }
          return next();
        } catch (error) {
          console.error(error);
          return res.status(500).send({ error });
        }
      }
    ];
  }

  static isEmailVerified = [
    Permissions.isAuthenticated,
    async (req, res, next) => {
      try {
        if (!req.user.emailVerified) {
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