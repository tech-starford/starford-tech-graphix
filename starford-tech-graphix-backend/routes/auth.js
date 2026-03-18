const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
// const authMiddleware = require('../middleware/auth');
const { authMiddleware } = require('../middleware/auth'); // destructure!

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;