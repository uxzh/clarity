const router = require('express').Router();

const ReviewsController = require('../controllers/reviewsController');
const loginRequired = require('../middleware/loginRequired');
const { createLikeschema } = require('../middleware/validation/schemas/likeSchema');
const { createReviewSchema } = require('../middleware/validation/schemas/reviewSchema');
const validate = require('../middleware/validation/validate');

router.post('/',
  loginRequired,
  validate(createReviewSchema),
  ReviewsController.createReview
);

router.post('/:id/like',
  loginRequired,
  validate(createLikeschema),
  ReviewsController.likeReview
);

router.delete('/:id/like',
  loginRequired,
  ReviewsController.deleteLike
);

module.exports = router;