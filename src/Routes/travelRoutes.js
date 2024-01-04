const express = require("express");
const router = express.Router();
const { newTravelPlanning } = require("../Controllers/travelController")

//------------POST METHOD || NEW TRAVEL PLANNING---------------

router.post("/newtravelplan", newTravelPlanning)

module.exports = router;