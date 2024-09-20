const router = require('express').Router();

const { usernameSchema } = require('../middleware/validation/schemas/usernameSchema');
const validate = require('../middleware/validation/validate');
const UsersController = require('../controllers/usersController');
const Permissions = require('../middleware/permissions');
const { updateUserSchema } = require('../middleware/validation/schemas/userSchema');
const { models } = require('../lib/models');

router.post('/check-username',
  Permissions.isAuthenticated,
  validate(usernameSchema),
  UsersController.checkUsernameExists
);

router.put('/:id',
  Permissions.isOwnerOrAdmin(models.users),
  validate(updateUserSchema),
  UsersController.updateUser
);

router.delete('/:id',
  Permissions.isOwnerOrAdmin(models.users),
  UsersController.deleteUser
);

module.exports = router;