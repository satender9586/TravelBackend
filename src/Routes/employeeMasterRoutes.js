const express = require("express")
const router = express.Router()
const { newEmployeeRegister } = require("../Controllers/employeeMaster")


// POST METHOD || NEW EMPLOYEE ADD BY ADMIN

router.post("/newemployeeregister", newEmployeeRegister)

module.exports = router