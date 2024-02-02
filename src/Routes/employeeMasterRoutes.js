const express = require("express")
const router = express.Router()
const { newEmployeeRegister, getemployeedetailsbyid } = require("../Controllers/employeeMaster")


// POST METHOD || NEW EMPLOYEE ADD BY ADMIN

router.post("/newemployeeregister", newEmployeeRegister)

router.get('/getemployeedetails/:employeeId', getemployeedetailsbyid);

module.exports = router