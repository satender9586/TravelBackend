const express = require("express")
const router = express.Router()
const { cliamsItemfun } = require("../Controllers/claimController")


router.post('/travalClaims', cliamsItemfun)

module.exports = router