const express = require('express');

const router = express.Router();

// router.use('/users', require('./usersRouter'));
router.use('/cards', require('./cardsRouter'));
router.use('/auth', require('./authRouter'));

module.exports = router;