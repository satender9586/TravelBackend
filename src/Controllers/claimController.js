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
            departure,
            arrival,
            from_time,
            to_time,
            travel_mode,
            ticket_no,
            attachment,
            checkin,
            checkout,
            no_night,
            local_date,
            food_date,
            other_date,
            place,
            remark,
            date,
        } = req.body;

        // Validate and parse amount
        let amountValue = null;
        if (amount && !isNaN(parseFloat(amount))) {
            amountValue = parseFloat(amount);
        }

        // Perform the database insertion
        await pool.query(
            `INSERT INTO reimbursement1 (
                travelid, claimid, amount, is_approved, from_location, to_location,
                travelclass, traveltype, departure, arrival, from_time, to_time,
                travel_mode, ticket_no, attachment, checkin, checkout, no_night,
                local_date, food_date, other_date, place, remark,date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                $15, $16, $17, $18, $19, $20, $21, $22, $23,$24)`,
            [
                travelid,
                claimid,
                amountValue,
                is_approved,
                from_location,
                to_location,
                travelclass,
                traveltype,
                departure,
                arrival,
                from_time,
                to_time,
                travel_mode,
                ticket_no,
                attachment,
                checkin,
                checkout,
                no_night,
                local_date,
                food_date,
                other_date,
                place,
                remark,
                date,
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
        const claimDetails = await pool.query('SELECT * FROM reimbursement1 WHERE travelid = $1 AND id = $2', [travelID, claimID]);

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
const getAllClaims = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if travelID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid travel ID to retrieve claims",
            });
        }

        // Retrieve all claims based on travelID
        const claims = await pool.query('SELECT * FROM reimbursement1 WHERE travelid = $1', [id]);

        return res.status(200).json({
            success: true,
            claims: claims.rows,
            message: "Claims retrieved successfully for the provided travel ID",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
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
        const claimDetails = await pool.query('SELECT is_approved FROM reimbursement1 WHERE travelid = $1 AND id = $2', [travelID, claimID]);

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
        await pool.query(`DELETE FROM reimbursement1 WHERE travelid = $1 AND id = $2`, [travelID, claimID]);

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
const updateClaims = async (req, res) => {
    try {
        const {
            claimid,
            travelid,
            amount,
            from_location,
            to_location,
            travelclass,
            traveltype,
            departure,
            arrival,
            from_time,
            to_time,
            travel_mode,
            ticket_no,
            attachment,
            checkin,
            checkout,
            no_night,
            local_date,
            food_date,
            other_date,
            place,
            remark,
            date,
        } = req.body;

        // Check if claimid and travelid are provided
        if (!claimid || !travelid) {
            return res.status(400).json({
                success: false,
                message: "Please provide both claimid and travelid for updating the claim",
            });
        }

        // Check if the claim exists in the database
        const claimExists = await pool.query('SELECT * FROM reimbursement1 WHERE id = $1 AND travelid = $2', [claimid, travelid]);
        if (claimExists.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No claim found for the provided claimid and travelid",
            });
        }

        // Perform the database update
        const updateQuery = `
            UPDATE reimbursement1 
            SET 
                amount = $1,
                from_location = $2,
                to_location = $3,
                travelclass = $4,
                traveltype = $5,
                departure = $6, 
                arrival = $7, 
                from_time = $8,
                to_time = $9,
                travel_mode = $10,
                ticket_no = $11,
                attachment = $12,
                checkin = $13,
                checkout = $14,
                no_night = $15,
                local_date = $16,
                food_date = $17,
                other_date = $18,
                place = $19,
                remark = $20,
                date = $21
            WHERE id = $22 AND travelid = $23`;

        const updateValues = [
            amount,
            from_location,
            to_location,
            travelclass,
            traveltype,
            departure,
            arrival,
            from_time,
            to_time,
            travel_mode,
            ticket_no,
            attachment,
            checkin,
            checkout,
            no_night,
            local_date,
            food_date,
            other_date,
            place,
            remark,
            date,
            claimid,
            travelid
        ];

        await pool.query(updateQuery, updateValues);

        // Send success response
        return res.status(200).json({
            success: true,
            message: 'Claim updated successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
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
const setAllClaimsAmount = async (req, res) => {
    try {
        const { id } = req.body;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid claim ID for claim update",
            });
        }

        // Check if ID already exists
        const idExists = await pool.query(`
         SELECT EXISTS (
             SELECT 1 
             FROM public.reimbursement1_total 
             WHERE claimid = ${id}
         );
     `);

        const existsResult = idExists.rows[0].exists;

        if (existsResult) {
            return res.status(400).json({
                success: false,
                message: "Claim is Alredy exists"
            })
        }

        await pool.query(`
            DO $$
            DECLARE
                total_amount numeric;
            BEGIN
                -- Calculate the total amount for the specified claimid
                SELECT COALESCE(SUM(amount), 0)
                INTO total_amount
                FROM public.reimbursement1
                WHERE travelid = ${id};

                -- Insert or update the total amount in the reimbursement1_total table
                BEGIN
                    INSERT INTO public.reimbursement1_total (claimid, total_amount)
                    VALUES (${id}, total_amount);
                EXCEPTION WHEN unique_violation THEN
                    UPDATE public.reimbursement1_total
                    SET total_amount = total_amount
                    WHERE claimid = ${id};
                END;
            END $$;
        `);

        return res.status(200).json({
            success: true,
            message: "Total amount updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};







module.exports = { cliamsItemfun, getClaimsdetails, getAllClaims, approvedClaims, delterClaim, updateClaims, setAllClaimsAmount };