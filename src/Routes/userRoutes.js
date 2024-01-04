const express = require('express');
const router = express.Router();
const { signup, signIn } = require("../Controllers/userController")

// -------------POST METHOD || SIGN UP-------------------//

router.post('/signup', signup);

// -------------POST METHOD || SIGN IN-------------------//

router.post('/singin', signIn);



module.exports = router;