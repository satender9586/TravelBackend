const pool = require('../../Config/dbConnect');
const { hashPassword, comparePassword } = require("../../helper/authHelper");
const JWT = require("jsonwebtoken")
const dotenv = require('dotenv');

const signup = async (req, res) => {
    let newUser = null;

    try {
        const { username, fname, lname, email, department, organization, phone, password, role, is_staff } = req.body;

        // // Check if the user with the provided id already exists
        // const existingUserById = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        // if (existingUserById.rows.length > 0) {
        //     // If a user with the provided id already exists, return an error
        //     return res.status(400).json({
        //         success: false,
        //         message: 'User with the provided id already exists',
        //     });
        // }
        const requiredFields = [
            "username", "fname", "lname", "email",
            "department", "organization", "phone", "password", "role",
            "is_staff"
        ];


        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if the username already exists
        const existingUserByUsername = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (existingUserByUsername.rows.length > 0) {
            // If a user with the provided username already exists, return an error
            return res.status(400).json({
                success: false,
                message: 'username already exists',
            });
        }

        // Check if the email already exists
        const existingUserByEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUserByEmail.rows.length > 0) {
            // If a user with the provided email already exists, return an error
            return res.status(400).json({
                success: false,
                message: 'email already exists',
            });
        }



        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            'INSERT INTO users (username, fname, lname, email, department, organization, phone, password, role, is_staff) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [username, fname, lname, email, department, organization, phone, hashedPassword, role, is_staff]
        );


        newUser = result.rows[0];

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// -------------------------------------------LOGIN FOR USERS---------------------------------------//

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        // Check if the user with the provided email exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            // If user not found, return an error
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if the provided password matches the stored hashed password
        const isPasswordValid = await comparePassword(password, user.rows[0].password);

        if (!isPasswordValid) {
            // If the password is invalid, return an error
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        // If both email and password are valid, you can create and send a token for authentication
        const token = await JWT.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email,
                role: user.rows[0].role,
            },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// -------------------------------------USER TOKEN VERIFICATION------------------------------


const tokenVerify = async (req, res) => {
    try {
        const { token } = req.body;

        JWT.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) {
                return res.json({ valid: false, message: "Invalid Auth" });
            }


            const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

            if (userQuery.rows.length === 0) {
                // If user not found, return an error
                return res.json({ valid: false });
            }

            const user = userQuery.rows[0];

            return res.json({
                valid: true,
                user: {
                    username: user.username,
                    role: user.role,
                },
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ valid: false, error: "Internal Server Error" });
    }
};

module.exports = { signup, signIn, tokenVerify };
