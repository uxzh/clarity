const router = require('express').Router();

const RepliesController = require('../controllers/repliesController');
const Permissions = require('../middleware/permissions');
const { createReplySchema } = require('../middleware/validation/schemas/replySchema');

const validate = require('../middleware/validation/validate');

router.post('/',
  Permissions.isAuthenticated,
  validate(createReplySchema), 
  RepliesController.createReply
);

module.exports = router;