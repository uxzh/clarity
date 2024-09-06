const router = require('express').Router();

const CardsController = require('../controllers/cardsController');

router.get('/', CardsController.getCards);

// todo
// router.post('/',
//   CardsController.createCard
// );

// todo
// router.put('/:id',
//   CardsController.updateCard
// );

// todo
// router.delete('/:id',
//   CardsController.deleteCard
// );

router.get('/top-cards', CardsController.getTopCards);

router.get('/:id/reviews', CardsController.getReviews);




module.exports = router;