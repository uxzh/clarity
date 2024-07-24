const router = require('express').Router();

const AuthController = require('../controllers/authController');
const signupSchema = require('../middleware/validation/schemas/signupSchema');
const loginSchema = require('../middleware/validation/schemas/loginSchema');
const validate = require('../middleware/validation/validate');

router.post('/signup', validate(signupSchema), AuthController.signup);
router.post('/login', validate(loginSchema), AuthController.login);

module.exports = router;