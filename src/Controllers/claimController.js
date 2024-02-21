const pool = require("../../Config/dbConnect");

const cliamsItemfun = async (req, res) => {
    try {
        const {
            travelid,
            claimid,
            amount,
            is_approved,
            from_location,
            to_location,
            travelclass,
            traveltype,
            depature,
            arrivel,
            from_time,
            to_time,
            travel_mode,
            ticket_no,
            attachement,
            checkin,
            checkout,
            no_night,
            local_date,
            food_date,
            other_date,
            place,
            remark,
        } = req.body;

        // Validate and parse amount
        let amountValue = null;
        if (amount && !isNaN(parseFloat(amount))) {
            amountValue = parseFloat(amount);
        }

        // Perform the database insertion
        await pool.query(
            `INSERT INTO reimbursement (
            travelid, claimid, amount, is_approved, from_location, to_location,
            travelclass, traveltype, depature, arrivel, from_time, to_time,
            travel_mode, ticket_no, attachement, checkin, checkout, no_night,
            local_date, food_date, other_date, place, remark
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
            [
                travelid,
                claimid,
                amountValue,
                is_approved,
                from_location,
                to_location,
                travelclass,
                traveltype,
                depature,
                arrivel,
                from_time,
                to_time,
                travel_mode,
                ticket_no,
                attachement,
                checkin,
                checkout,
                no_night,
                local_date,
                food_date,
                other_date,
                place,
                remark,
            ]
        );

        // Send success response
        return res.status(201).json({
            success: true,
            message: 'New claim created successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const getClaimsdetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if id is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid ID for claim details",
            });
        }

        // Split the id into travelID and claimID
        const [travelID, claimID] = id.split('-');

        // Retrieve claim details based on travelID and claimID
        const claimDetails = await pool.query('SELECT * FROM reimbursement WHERE travelid = $1 AND id = $2', [travelID, claimID]);

        // Check if any claim details found
        if (claimDetails.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No claim details found for the provided IDs",
                travelID,
                claimID
            });
        }

        // Return the retrieved claim details
        return res.status(200).json({
            success: true,
            message: "Retrieved claims based on IDs successfully",
            claims: claimDetails.rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const delterClaim = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid claim ID for claim deletion",
            });
        }

        // Split the id into travelID and claimID
        const [travelID, claimID] = id.split('-');

        // Retrieve claim details to check if it is approved
        const claimDetails = await pool.query('SELECT is_approved FROM reimbursement WHERE travelid = $1 AND id = $2', [travelID, claimID]);

        // Check if any claim details found
        if (claimDetails.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No claim found for the provided ID",
                id: id
            });
        }

        // Check if claim is approved
        if (claimDetails.rows[0].is_approved === true) {
            return res.status(403).json({
                success: false,
                message: "Cannot delete an approved claim"
            });
        }

        // Delete the claim based on travelID and id
        await pool.query(`DELETE FROM reimbursement WHERE travelid = $1 AND id = $2`, [travelID, claimID]);

        return res.status(200).json({
            success: true,
            message: "Claim deleted successfully",
            id: id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const approvedClaims = async (req, res) => {
    try {
        const { claimid } = req.params;

        // Check if claim ID is provided
        if (!claimid) {
            return res.status(400).json({
                success: false,
                message: "Please provide a claim ID for updating claims"
            });
        }

        // Check if claim ID exists
        const isClaimIdExist = await pool.query('SELECT * FROM reimbursement_total WHERE claimid = $1', [claimid]);
        if (isClaimIdExist.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No claim details found for the provided ID",
                id: claimid
            });
        }

        // Update claim status to "approved"
        await pool.query('UPDATE reimbursement_total SET status = $1 WHERE claimid = $2', ['approved', claimid]);

        // Update reimbursement_total table to set is_approved to true
        await pool.query('UPDATE reimbursement_total SET is_approved = $1 WHERE claimid = $2', [true, claimid]);
        // Update rembursement table to set is_approved to true
        await pool.query('UPDATE reimbursement SET is_approved = $1 WHERE claimid = $2', [true, claimid]);


        return res.status(200).json({
            success: true,
            message: "Claim approved successfully",
            id: claimid
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




module.exports = { cliamsItemfun, getClaimsdetails, approvedClaims, delterClaim };