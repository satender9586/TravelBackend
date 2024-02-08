const express = require("express");
const router = express.Router();
const { newTravelPlanning, updatetravelplanstatus2, getTravelRequestDetails, getAllTravelList, updatetravelplanstatus, getEmployeeDetailsAndTravelRequests, deleterTravelplan, updateTravelplan } = require("../Controllers/travelController")

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

// --------------GET METHOD || GET ALL TRAVEL PLAN LISR---------------------------

router.get("/travelplanlist", getAllTravelList)

//------------ POST METHOD || approve travel status ---------------
router.put("/updatetravelplanstatus", updatetravelplanstatus)

//------------ POST METHOD || reject travel status ---------------
router.put("/updatetravelplanstatusreject", updatetravelplanstatus2)

module.exports = router;