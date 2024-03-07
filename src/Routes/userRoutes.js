const express = require('express');
const router = express.Router();
const { signup, signIn, tokenVerify, otpVerify } = require("../Controllers/userController")

// -------------POST METHOD || SIGN UP-------------------//

router.post('/signup', signup);

// -------------POST METHOD || SIGN IN-------------------//

router.post('/singin', signIn);

// --------------------OTP_VERIFY--------------------------
router.post('/otp-verify', otpVerify);

// -------------POST METHOD || Token verify-------------------//

router.post('/token-verify', tokenVerify);




module.exports = router;