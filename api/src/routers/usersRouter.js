const router = require('express').Router();

const { usernameSchema } = require('../middleware/validation/schemas/usernameSchema');
const validate = require('../middleware/validation/validate');
const UsersController = require('../controllers/usersController');
const Permissions = require('../middleware/permissions');
const { updateUserSchema } = require('../middleware/validation/schemas/userSchema');

router.post('/check-username',
  Permissions.isAuthenticated,
  validate(usernameSchema),
  UsersController.checkUsernameExists
);

router.put('/:id',
  Permissions.isOwnerOrAdmin,
  validate(updateUserSchema),
  UsersController.updateUser
);

module.exports = router;