const router = require('express').Router();

const usernameSchema = require('../middleware/validation/schemas/usernameSchema');
const validate = require('../middleware/validation/validate');
const UsersController = require('../controllers/usersController');
const Permissions = require('../middleware/permissions');

router.post('/check-username',
  Permissions.isAuthenticated,
  validate(usernameSchema),
  UsersController.checkUsernameExists
);

router.put('/:id/update-username',
  Permissions.isOwnerOrAdmin,
  UsersController.updateUsername
);

module.exports = router;