const pool = require("../../Config/dbConnect")




const newTravelPlanning = async (req, res) => {
    try {
        const {

            requesttype, traveltype, travelarea, bookedby,
            startdate, enddate, totaldays, travelpurpose, travelreason,
            baselocation, destlocation, advanceamount, description, employeeid
        } = req.body;

        // Check if any required field is missing
        const requiredFields = [
            "requesttype", "traveltype", "travelarea", "bookedby",
            "startdate", "enddate", "totaldays", "travelpurpose", "travelreason",
            "baselocation", "destlocation", "advanceamount", "description", "employeeid"
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const t_id = Math.floor(Math.random() * 100000000);
        // Enter travel request
        const result = await pool.query(`
        INSERT INTO travel_plan (
            travel_id, requesttype, traveltype, travelarea, bookedby,
            startdate, enddate, totaldays, travelpurpose, travelreason,
            baselocation, destlocation, advanceamount, description, employeeid
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            [
                t_id, requesttype, traveltype, travelarea, bookedby,
                startdate, enddate, totaldays, travelpurpose, travelreason,
                baselocation, destlocation, advanceamount, description, employeeid
            ]
        );



        const newUser = result.rows[0];

        return res.status(201).json({
            success: true,
            message: "Travel Request Added Successfully",
            data: newUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getTravelRequestDetails = async (req, res) => {
    try {
        const { travel_id } = req.body;

        // Check if the travel_id is provided
        if (!travel_id) {
            return res.status(400).json({
                success: false,
                message: "Travel id is missing"
            });
        }

        // Fetch the details of the travel request
        const result = await pool.query(`
            SELECT * FROM travel_plan
            WHERE travel_id = $1`,
            [travel_id]
        );

        // Check if the travel request was found
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Travel Request does not exist"
            });
        }

        const travelRequestDetails = result.rows[0];

        return res.status(200).json({
            success: true,
            data: travelRequestDetails
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

const getEmployeeDetailsAndTravelRequests = async (req, res) => {
    try {
        const { employeeid } = req.body;

        // Check if the employeeid is provided
        if (!employeeid) {
            return res.status(400).json({
                success: false,
                message: "User id is missing"
            });
        }

        // Retrieve employee details from the user table
        const userResult = await pool.query('SELECT * FROM users WHERE employeeid = $1', [employeeid]);

        // Check if the user exists
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const employeeDetails = userResult.rows[0];

        // Log user details for troubleshooting
        console.log('Employee Details:', employeeDetails);

        // Retrieve all travel requests for the specified employeeid from the travel_plan table
        const travelResult = await pool.query('SELECT * FROM travel_plan WHERE employeeid = $1', [employeeid]);

        const travelRequests = travelResult.rows;

        return res.status(200).json({
            success: true,
            employeeDetails,
            travelRequests
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleterTravelplan = async (req, res) => {
    try {
        const { travel_id } = req.body;

        if (!travel_id) {
            return res.status(404).json({
                success: false,
                message: "Travel id is required for deletion"
            });
        }

        // Use await here to ensure the query is executed asynchronously
        const existingTravel = await pool.query('SELECT * FROM travel_plan WHERE travel_id = $1', [travel_id]);

        if (existingTravel.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Travel Item Does Not Exist"
            });
        }

        if (existingTravel.rows[0].is_approved === true) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete an approved item"
            });
        }

        // Delete the travel record
        await pool.query('DELETE FROM travel_plan WHERE travel_id = $1', [travel_id]);

        return res.status(200).json({
            success: true,
            message: "Travel request deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

const updateTravelplan = async (req, res) => {
    try {
        const {
            travel_id,
            requesttype, traveltype, travelarea, bookedby,
            startdate, enddate, totaldays, travelpurpose, travelreason,
            baselocation, destlocation, advanceamount, description
        } = req.body;

        // Check if any required field is missing
        const requiredFields = [
            "requesttype", "traveltype", "travelarea", "bookedby",
            "startdate", "enddate", "totaldays", "travelpurpose", "travelreason",
            "baselocation", "destlocation", "advanceamount", "description",
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        if (!travel_id) {
            return res.status(400).json({
                success: false,
                message: "travel id is required"
            });
        }

        // Check if the travel plan exists based on travel_id
        const existtravelItem = await pool.query(`SELECT * FROM travel_plan WHERE travel_id = $1`, [travel_id]);

        if (existtravelItem.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Item does not exist"
            });
        }

        // Check if the travel record is approved
        if (existtravelItem.rows[0].is_approved === true) {
            return res.status(403).json({
                success: false,
                message: "You cannot update an approved item"
            });
        }

        // Update the travel record
        const updatedTravel = await pool.query(`
         UPDATE travel_plan 
         SET requesttype = $1, traveltype = $2, travelarea = $3, bookedby = $4,
             startdate = $5, enddate = $6, totaldays = $7, travelpurpose = $8,
             travelreason = $9, baselocation = $10, destlocation = $11,
             advanceamount = $12, description = $13
         WHERE travel_id = $14
         RETURNING *`,
            [
                requesttype, traveltype, travelarea, bookedby, startdate, enddate, totaldays,
                travelpurpose, travelreason, baselocation, destlocation, advanceamount, description, travel_id
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Travel request updated successfully",
            data: updatedTravel.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};


const getAllTravelList = async (req, res) => {
    try {
        const travelPlans = await pool.query('SELECT * FROM travel_plan')
        if (travelPlans.rows.length > 0) {
            res.status(200).json({
                success: true,
                message: "All Travel Plan List",
                travelPlans: travelPlans.rows
            })
        } else {
            res.status(404).json({
                success: false,
                message: "No travel Plans found"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}


const updatetravelplanstatus = async (req, res) => {
    try {
        const { travelid } = req.body;

        const isTravelplanExit = await pool.query(`SELECT * FROM travel_plan WHERE travel_id = $1`, [travelid]);

        if (isTravelplanExit.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Travel plan does not exist",
                travelid: travelid
            });
        }

        // Update the status of the travel plan
        const updateStatus = await pool.query(`UPDATE travel_plan SET status = $1 WHERE travel_id = $2`, ['approve', travelid]);

        res.status(200).json({
            success: true,
            message: "Travel plan approved successfully",
            travelid: travelid
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
const updatetravelplanstatus2 = async (req, res) => {
    try {
        const { travelid } = req.body;

        const isTravelplanExit = await pool.query(`SELECT * FROM travel_plan WHERE travel_id = $1`, [travelid]);

        if (isTravelplanExit.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Travel plan does not exist",
                travelid: travelid
            });
        }
        if (isTravelplanExit.rows[0].status === 'approve') {
            return res.status(200).json({
                success: false,
                message: "Item is  approved you can not reject",
                id: travelid
            });
        }

        // Update the status of the travel plan
        const updateStatus = await pool.query(`UPDATE travel_plan SET status = $1 WHERE travel_id = $2`, ['reject', travelid]);

        res.status(200).json({
            success: true,
            message: "Travel plan Reject successfully",
            travelid: travelid
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = { newTravelPlanning, updatetravelplanstatus2, getTravelRequestDetails, updatetravelplanstatus, getEmployeeDetailsAndTravelRequests, deleterTravelplan, updateTravelplan, getAllTravelList };
