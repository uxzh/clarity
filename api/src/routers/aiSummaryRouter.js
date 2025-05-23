const router = require('express').Router();
const AISummaryController = require('../controllers/aiSummaryController');
const { setCacheHeaders } = require('../middleware/cacheHeaders');

// Route to generate a summary for a card based on its reviews and description
router.get('/card/:cardId',
    setCacheHeaders(300), // Cache for 5 minutes
    AISummaryController.generateCardSummary
);

module.exports = router;
