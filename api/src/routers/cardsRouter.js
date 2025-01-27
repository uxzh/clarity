const router = require('express').Router();

const CardsController = require('../controllers/cardsController');
const {setCacheHeaders} = require('../middleware/cacheHeaders');
const Permissions = require('../middleware/permissions');
const {updateCardSchema, createCardSchema} = require('../middleware/validation/schemas/cardSchema');
const validate = require('../middleware/validation/validate');

router.get('/',
    setCacheHeaders(300),
    CardsController.getCards
);

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
    Permissions.isAdmin,
    CardsController.deleteCard
);

router.get('/top-cards',
    setCacheHeaders(300),
    CardsController.getTopCards
);

router.get('/default-search',
    setCacheHeaders(300),
    CardsController.getDefaultSearchCards
);

router.get('/:id',
    setCacheHeaders(300),
    CardsController.getCard
);

router.get('/:id/reviews',
    setCacheHeaders(300),
    CardsController.getReviewsByCard
);


module.exports = router;
