const express = require("express")
const router = express.Router()
const { getAllReimbursements, checkClaimExists, cliamsItemfun, getClaimsdetails, getAllClaims, updateClaims, approvedClaims, delterClaim, setAllClaimsAmount } = require("../Controllers/claimController")

// POST METHOD || NEW CLAIMS
router.post('/travalClaims', cliamsItemfun)

// GET METHOD || RETRIVE CLAIMS DETAILS
router.get("/getuserclaims/:id", getClaimsdetails)

// GET METHOD || RETRIVE CLAIMS All
router.get("/getallClaimd/:id", getAllClaims)
// PUT METHOD || RETRIVE CLAIMS DETAILS
router.put("/approvedClaims/:claimid", approvedClaims)

// POST METHOD || UPDATECLAIMS
router.post("/updateClaims", updateClaims)

// PUT METHOD || RETRIVE CLAIMS DETAILS
router.delete("/deleteClaims/:id", delterClaim)

// post METHOD || set ammmount
router.post("/claimsTotal", setAllClaimsAmount)

// post METHOD || isClaimExist
router.post("/isclaimexist", checkClaimExists)

// get METHOD || fetchAllclaims
router.get("/getallrembusement", getAllReimbursements)

module.exports = router