const pool = require("../../Config/dbConnect");
const { generateSerialNumber } = require("../../helper/authHelper");




// Function to check if the email already exists
const isEmailExists = async (email) => {
    const result = await pool.query('SELECT 1 FROM employee_master WHERE email = $1', [email]);
    return result.rows.length > 0;
};

// new employee registration
const newEmployeeRegister = async (req, res) => {
    try {
        const { grade, designation, location, email, fname, lname } = req.body;

        // Check required fields
        const requiredFields = ['grade', 'designation', 'location', 'email', 'fname', 'lname'];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if the email already exists
        const emailExists = await isEmailExists(email);
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists. Please use a different email address.',
            });
        }

        const generateNumber = generateSerialNumber();

        // Insert the user
        const result = await pool.query(
            'INSERT INTO employee_master(employeeid, grade, designation, location, email, fname, lname) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [generateNumber, grade, designation, location, email, fname, lname]
        );

        const newUser = result.rows[0];

        res.status(201).json({
            success: true,
            message: 'Employee registered successfully',
            user: newUser,
        });
    } catch (error) {
        console.error(error);

        // Check if it's a unique constraint violation
        if (error.code === '23505' && error.constraint === 'employee_master_email_key') {
            return res.status(400).json({
                success: false,
                message: 'Duplicate key violation. Email already exists.',
            });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get employee details by ID
const getEmployeeDetailsById = async (employeeId) => {
    const result = await pool.query('SELECT * FROM employee_master WHERE employeeid = $1', [employeeId]);
    return result.rows[0];
};

const getemployeedetailsbyid = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employeeDetails = await getEmployeeDetailsById(employeeId);

        if (!employeeDetails) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee details retrieved successfully',
            user: employeeDetails,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { newEmployeeRegister, getemployeedetailsbyid };
