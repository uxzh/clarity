const router = require('express').Router();

const ReviewsController = require('../controllers/reviewsController');
const Permissions = require('../middleware/permissions');
const { createLikeschema } = require('../middleware/validation/schemas/likeSchema');
const { createReviewSchema } = require('../middleware/validation/schemas/reviewSchema');
const validate = require('../middleware/validation/validate');

router.post('/',
  Permissions.isAuthenticated,
  validate(createReviewSchema),
  ReviewsController.createReview
);

router.post('/:id/like',
  Permissions.isAuthenticated,
  validate(createLikeschema),
  ReviewsController.likeReview
);

router.delete('/:id/like',
  Permissions.isAuthenticated,
  ReviewsController.deleteLike
);

module.exports = router;