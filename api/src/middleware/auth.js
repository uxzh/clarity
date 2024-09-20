const jwt = require('../lib/jwt');
const UsersDAO = require('../dao/usersDAO');

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      req.user = null;
      return next();
    }
    try {
        const decodedValue = jwt.verify(authorization.slice(7));
        const user = await UsersDAO.getOneById(decodedValue._id);
        if (user && !user.error) {
          const isAdmin = user.role === 'admin';
          req.user = { ...user, ...decodedValue, isAdmin };
        }
        return next();
    } catch(error) {
      return next();
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
}

module.exports = {
  auth,
};