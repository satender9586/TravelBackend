const express = require("express");
const router = express.Router();
const { newTravelPlanning, getTravelRequestDetails, getEmployeeDetailsAndTravelRequests, deleterTravelplan, updateTravelplan } = require("../Controllers/travelController")

//------------ POST METHOD || NEW TRAVEL PLANNING ---------------

router.post("/newtravelplan", newTravelPlanning)
//------------ POST METHOD || NEW TRAVEL PLANNING ---------------

router.post("/gettraveldetails", getTravelRequestDetails)

//------------ POST METHOD || GET TREVEL ITEM BASE ON USER ID ---------------

router.post("/getalltraveldetails", getEmployeeDetailsAndTravelRequests)

//------------ POST METHOD || GET TREVEL ITEM BASE ON USER ID ---------------

router.post("/deletetravelplan", deleterTravelplan)

//------------ POST METHOD || GET TREVEL ITEM BASE ON USER ID ---------------

router.put("/updatetravelplan", updateTravelplan)

module.exports = router;