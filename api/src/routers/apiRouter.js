const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});
router.use('/cards', require('./cardsRouter'));
router.use('/auth', require('./authRouter'));
router.use('/users', require('./usersRouter'));
router.use('/reviews', require('./reviewsRouter'));
router.use('/replies', require('./repliesRouter'));
router.use('/admin', require('./adminRouter'));

module.exports = router;
