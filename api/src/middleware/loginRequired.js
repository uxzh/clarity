const loginRequired = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('User is not authorized to access this endpoint');
  }
  return next();
}

module.exports = loginRequired;