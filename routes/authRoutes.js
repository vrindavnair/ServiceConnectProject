const express = require('express');
const router = express.Router();
const { signup, verifyOtp, resendOtp, login } = require('../controller/authController');


router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);




module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { signup, verifyOtp, login, resendOtp } = require('../controller/authController');

// router.post('/signup', signup);
// router.post('/verify-otp', verifyOtp);
// router.post('/resend-otp', resendOtp);
// router.post('/login', login);

// module.exports = router;
