// const express = require('express');
// const router = express.Router();
// const { signup } = require('../controller/authController');


// router.post('/signup', signup);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { signup, verifyOtp, login } = require('../controller/authController');

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

module.exports = router;
