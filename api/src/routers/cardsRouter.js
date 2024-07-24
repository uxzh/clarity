const router = require('express').Router();

const CardsController = require('../controllers/cardsController');

router.get('/', CardsController.getCards);

module.exports = router;