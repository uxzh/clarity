const router = require('express').Router();

const ReviewsController = require('../controllers/reviewsController');
const Permissions = require('../middleware/permissions');
const { likeSchema } = require('../middleware/validation/schemas/likeSchema');
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

router.get('/',
  ReviewsController.getReviews
);

module.exports = router;
