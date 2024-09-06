const router = require('express').Router();

const ReviewsController = require('../controllers/reviewsController');
const { models } = require('../lib/models');
const Permissions = require('../middleware/permissions');
const { createLikeschema } = require('../middleware/validation/schemas/likeSchema');
const { createReviewSchema } = require('../middleware/validation/schemas/reviewSchema');
const validate = require('../middleware/validation/validate');

router.get('/:id',
  ReviewsController.getReview
)

router.post('/',
  Permissions.isEmailVerified,
  validate(createReviewSchema),
  ReviewsController.createReview
);

router.delete('/:id',
  Permissions.isOwnerOrAdmin,
  ReviewsController.deleteReview
);

router.post('/:id/like',
  Permissions.isEmailVerified,
  Permissions.isOwnerOrAdmin(models.reviews),
  validate(createLikeschema),
  ReviewsController.likeReview
);

router.delete('/:id/like',
  Permissions.isOwnerOrAdmin(models.reviews),
  ReviewsController.deleteLike
);

module.exports = router;