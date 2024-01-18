const pool = require("../../Config/dbConnect")




const newTravelPlanning = async (req, res) => {
    try {
        const {

            requesttype, traveltype, travelarea, bookedby,
            startdate, enddate, totaldays, travelpurpose, travelreason,
            baselocation, destlocation, advanceammount, description, user_id
        } = req.body;

        // Check if any required field is missing
        const requiredFields = [
            "requesttype", "traveltype", "travelarea", "bookedby",
            "startdate", "enddate", "totaldays", "travelpurpose", "travelreason",
            "baselocation", "destlocation", "advanceammount", "description", "user_id"
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
            baselocation, destlocation, advanceammount, description, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            [
                t_id, requesttype, traveltype, travelarea, bookedby,
                startdate, enddate, totaldays, travelpurpose, travelreason,
                baselocation, destlocation, advanceammount, description, user_id
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


module.exports = { newTravelPlanning };
