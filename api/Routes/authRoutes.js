const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../Controllers/authcontroller');

// Routes for signup and signin
router.get('/signUp', (req, res) => res.render('signUp'));
router.post('/signUp', signUp);

router.get('/signIn', (req, res) => res.render('signIn'));
router.post('/signIn', signIn);

module.exports = router;

