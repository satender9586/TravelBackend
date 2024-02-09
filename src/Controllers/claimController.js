const pool = require("../../Config/dbConnect");


const cliamsItemfun = async (req, res) => {
    try {
        const { travel_id, user_id, base_location, to_location, travel_type, amount, start_date, end_date,
            start_time,
            end_time,
            mode_of_travel,
            claim_type,
            ticket_no } = req.body

        // Check if user_id exists in employee_master table
        const isUserExist = await pool.query(`SELECT * FROM employee_master WHERE employeeid = $1`, [user_id]);
        if (isUserExist.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `The provided user_id (${user_id}) does not exist in the employee_master table`
            });
        }

        // Check if travel_id exists in travel_plan table
        const isTravelIdValid = await pool.query(`SELECT * FROM travel_plan WHERE travel_id = $1`, [travel_id]);
        if (isTravelIdValid.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `The provided travel_id (${travel_id}) does not exist in the travel_plan table`
            });
        }
        // const travelStatus = isTravelIdValid.rows[0].status;
        // if (travelStatus !== 'approved') {
        //     return res.status(400).json({
        //         success: false,
        //         message: `The travel plan with travel_id ${travel_id} is not approved`
        //     });
        // }



        const isclaimAllredyExit = await pool.query(`SELECT * FROM claims WHERE travel_id = $1 AND user_id = $2 AND claim_type = $3`, [travel_id, user_id, claim_type]);

        if (isclaimAllredyExit.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "A claim with the same travel_id and claim_type already exists for the user"
            });
        }

        const insertResult = await pool.query(`INSERT INTO claims (travel_id, user_id, base_location, to_location, travel_type, amount, start_date, end_date, start_time, end_time, mode_of_travel, claim_type, ticket_no) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, [travel_id, user_id, base_location, to_location, travel_type, amount, start_date, end_date, start_time, end_time, mode_of_travel, claim_type, ticket_no]);

        return res.status(201).json({
            success: true,
            message: "New claim created successfully",
            insertResult: insertResult.rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = { cliamsItemfun };