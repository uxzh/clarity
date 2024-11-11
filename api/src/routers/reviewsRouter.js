const router = require('express').Router();

const ReviewsController = require('../controllers/reviewsController');
const { models } = require('../lib/models');
const { setCacheHeaders } = require('../middleware/cacheHeaders');
const Permissions = require('../middleware/permissions');
const { likeSchema } = require('../middleware/validation/schemas/likeSchema');
const { createReviewSchema, updateReviewSchema } = require('../middleware/validation/schemas/reviewSchema');
const validate = require('../middleware/validation/validate');

router.get('/',
  Permissions.isAdmin,
  ReviewsController.getReviews
);

router.get('/:id',
  ReviewsController.getReview
)

router.post('/',
  Permissions.isEmailVerified,
  validate(createReviewSchema),
  ReviewsController.createReview
);

router.put('/:id',
  Permissions.isOwnerOrAdmin(models.reviews),
  validate(updateReviewSchema),
  ReviewsController.updateReview
);

router.delete('/:id',
  Permissions.isOwnerOrAdmin(models.reviews),
  ReviewsController.deleteReview
);

// likes
router.post('/:id/like',
  Permissions.isEmailVerified,
  validate(likeSchema),
  ReviewsController.likeReview
);

router.put('/:id/like',
  Permissions.isEmailVerified,
  validate(likeSchema),
  ReviewsController.updateReviewLike,
);

router.delete('/:id/like',
  Permissions.isAuthenticated,
  ReviewsController.deleteLike
);

// replies
router.get('/:id/replies',
  setCacheHeaders(300),
  ReviewsController.getRepliesByReview
);

module.exports = router;