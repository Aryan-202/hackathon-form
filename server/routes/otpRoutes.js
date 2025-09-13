const express = require('express');
const { verifyOTP, resendOTP } = require('../controllers/otpController');

const router = express.Router();

router.post('/verify', verifyOTP);
router.post('/resend', resendOTP);

module.exports = router;