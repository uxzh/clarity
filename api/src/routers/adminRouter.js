const router = require('express').Router();
const AdminController = require('../controllers/adminController');
const Permissions = require('../middleware/permissions');

router.get('/users', Permissions.isAdmin, AdminController.getUsers);
router.get('/comments', Permissions.isAdmin, AdminController.getComments);
router.get('/credit-cards', Permissions.isAdmin, AdminController.getCreditCards);

module.exports = router;
