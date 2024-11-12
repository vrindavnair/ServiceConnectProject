// routes/authRoutes.js
const express = require('express');
const { signup, verifyOTP, signin } = require('../controller/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP)
router.post('/signin', signin);

module.exports = router;
