const Permissions = require('../middleware/permissions');
const AdminController = require('../controllers/adminController');

const router = require('express').Router();

router.get('/totals',
  Permissions.isAdmin,
  AdminController.getTotals
);

module.exports = router;