const router = require('express').Router();

const CardsController = require('../controllers/cardsController');
const Permissions = require('../middleware/permissions');
const { updateCardSchema, createCardSchema } = require('../middleware/validation/schemas/cardSchema');
const validate = require('../middleware/validation/validate');

router.get('/', CardsController.getCards);

router.post('/',
  Permissions.isAdmin,
  validate(createCardSchema),
  CardsController.createCard
);

router.put('/:id',
  Permissions.isAdmin,
  validate(updateCardSchema),
  CardsController.updateCard
);

router.delete('/:id',
  CardsController.deleteCard
);

router.get('/top-cards', CardsController.getTopCards);

router.get('/default-search', CardsController.getDefaultSearchCards);

router.get('/:id', CardsController.getCard);

router.get('/:id/reviews', CardsController.getReviewsByCard);




module.exports = router;