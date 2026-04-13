// server/routes/auth.js
const router = require('express').Router();
const { register, login } = require('../server/controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;