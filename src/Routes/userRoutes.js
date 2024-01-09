const express = require('express');
const router = express.Router();
const { signup, signIn, tokenVerify } = require("../Controllers/userController")

// -------------POST METHOD || SIGN UP-------------------//

router.post('/signup', signup);

// -------------POST METHOD || SIGN IN-------------------//

router.post('/singin', signIn);

// -------------POST METHOD || Token verify-------------------//

router.post('/token-verify', tokenVerify);



module.exports = router;