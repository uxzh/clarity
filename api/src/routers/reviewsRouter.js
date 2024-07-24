const router = require('express').Router();

const ReviewsController = require('../controllers/reviewsController');
const loginRequired = require('../middleware/loginRequired');
const { createLikeschema } = require('../middleware/validation/schemas/likeSchema');
const { createReviewSchema } = require('../middleware/validation/schemas/reviewSchema');
const validate = require('../middleware/validation/validate');

router.post('/', validate(createReviewSchema), loginRequired,
 ReviewsController.createReview);

router.post('/:id/like', validate(createLikeschema), loginRequired, ReviewsController.likeReview);

router.delete('/:id/like', loginRequired, ReviewsController.deleteLike);

module.exports = router;