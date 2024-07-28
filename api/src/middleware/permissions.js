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

  static isAdmin(req, res, next) {
    try {
      if (!req.user.role === 'admin') {
        return res.status(403).send('User is not authorized to access this endpoint');
      }
      return next();
    } catch (error) {
      return res.status(500).send({ error });
    }
  }

  static isOwnerOrAdmin(req, res, next) {
    try {
      const id = req.params.id;
      if (req.user._id !== id && req.user.role !== 'admin') {
        return res.status(403).send('User is not authorized to access this endpoint');
      }
      return next();
    } catch (error) {
      return res.status(500).send({ error });
    }
  }
}

module.exports = Permissions;