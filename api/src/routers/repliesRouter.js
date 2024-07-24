const router = require('express').Router();

const RepliesController = require('../controllers/repliesController');
const loginRequired = require('../middleware/loginRequired');
const { createReplySchema } = require('../middleware/validation/schemas/replySchema');

const validate = require('../middleware/validation/validate');

router.post('/', validate(createReplySchema), loginRequired,
 RepliesController.createReply);

module.exports = router;