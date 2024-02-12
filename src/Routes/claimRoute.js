const express = require("express")
const router = express.Router()
const { cliamsItemfun, getClaimsdetails, approvedClaims, delterClaim } = require("../Controllers/claimController")

// POST METHOD || NEW CLAIMS
router.post('/travalClaims', cliamsItemfun)

// GET METHOD || RETRIVE CLAIMS DETAILS
router.get("/getuserclaims/:id", getClaimsdetails)

// PUT METHOD || RETRIVE CLAIMS DETAILS
router.put("/approvedClaims/:id", approvedClaims)

// PUT METHOD || RETRIVE CLAIMS DETAILS
router.delete("/deleteClaims/:id", delterClaim)


module.exports = router