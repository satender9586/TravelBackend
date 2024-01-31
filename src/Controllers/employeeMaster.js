const pool = require("../../Config/dbConnect")
const { generateSerialNumber } = require("../../helper/authHelper");


const newEmployeeRegister = async (req, res) => {
    const newUser = null

    try {
        const { grade, designation, location } = req.body;

        // check requried first exist
        const requiredFields = ['grade', 'designation', 'location'];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const generateNumber = generateSerialNumber()
        // Enter the user
        const result = await pool.query('INSERT INTO employee_master( employeeid,grade, designation, location) Values ($1, $2, $3, $4) RETURNING *',
            [generateNumber, grade, designation, location])

        const newUser = result.rows[0]

        res.status(201).json({
            success: true,
            message: 'User register sucsessfully',
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { newEmployeeRegister }