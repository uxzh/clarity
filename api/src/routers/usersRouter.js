const router = require('express').Router();

const usernameSchema = require('../middleware/validation/schemas/usernameSchema');
const validate = require('../middleware/validation/validate');
const loginRequired = require('../middleware/loginRequired');
const UsersController = require('../controllers/usersController');

router.post('/check-username',
  loginRequired,
  validate(usernameSchema),
  UsersController.checkUsernameExists
);

module.exports = router;