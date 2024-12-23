// const express = require('express');
// const { register, login } = require('../Middlewares/authController');
// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;


const express = require('express');
const router = express.Router();
const authController = require('../Middlewares/authController');

// Routes for signup and signin
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;

