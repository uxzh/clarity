const router = require('express').Router();

const RepliesController = require('../controllers/repliesController');
const {models} = require('../lib/models');
const {setCacheHeaders} = require('../middleware/cacheHeaders');
const Permissions = require('../middleware/permissions');
const {createReplySchema} = require('../middleware/validation/schemas/replySchema');

const validate = require('../middleware/validation/validate');

router.post('/',
    Permissions.isAuthenticated,
    validate(createReplySchema),
    RepliesController.createReply
);

router.put('/:id',
    Permissions.isOwnerOrAdmin(models.replies),
    RepliesController.updateReply
);

router.delete('/:id',
    Permissions.isOwnerOrAdmin(models.replies),
    RepliesController.deleteReply
);
router.get('/:id/replies',
    setCacheHeaders(300),
    RepliesController.getRepliesByReview
);

module.exports = router;
