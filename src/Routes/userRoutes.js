const express = require('express');
const router = express.Router();
const { signup, signIn } = require("../Controllers/userController")

router.post('/signup', signup);
router.post('/singin', signIn);

module.exports = router;