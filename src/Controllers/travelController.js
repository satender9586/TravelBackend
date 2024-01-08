const pool = require("../../Config/dbConnect")

const newTravelPlanning = async (req, res) => {
    try {
        const {
            requesttype, traveltype, travelarea, bookedby,
            startdate, enddate, totaldays, travelpurpose, travelreason,
            baselocation, destlocation, advanceammount, description
        } = req.body;

        // Check if any required field is missing
        const requiredFields = [
            "requesttype", "traveltype", "travelarea", "bookedby",
            "startdate", "enddate", "totaldays", "travelpurpose", "travelreason",
            "baselocation", "destlocation", "advanceammount", "description"
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Enter travel request
        const result = await pool.query(`
            INSERT INTO travel_plan (
                requesttype, traveltype, travelarea, bookedby,
                startdate, enddate, totaldays, travelpurpose, travelreason,
                baselocation, destlocation, advanceammount, description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
            [
                requesttype, traveltype, travelarea, bookedby,
                startdate, enddate, totaldays, travelpurpose, travelreason,
                baselocation, destlocation, advanceammount, description
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
