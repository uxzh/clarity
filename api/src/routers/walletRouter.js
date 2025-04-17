const router = require('express').Router();
const RepliesController = require('../controllers/repliesController');
const WalletController = require('../controllers/walletController');
const {models} = require('../lib/models');
const {setCacheHeaders} = require('../middleware/cacheHeaders');
const Permissions = require('../middleware/permissions');

router.get('/',
  Permissions.isAuthenticated,
  WalletController.getWalletCards
);

router.post('/:id',
    Permissions.isAuthenticated,
    WalletController.addCardToWallet
);

router.delete('/:id',
  Permissions.isAuthenticated,
  WalletController.removeCardToWallet
);

module.exports = router;