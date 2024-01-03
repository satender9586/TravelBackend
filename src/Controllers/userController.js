const pool = require('../../Config/dbConnect');
const { hashPassword, comparePassword } = require("../../helper/authHelper");
const JWT = require("jsonwebtoken")
const dotenv = require('dotenv');

const signup = async (req, res) => {
    let newUser = null;

    try {
        const { id, username, email, password, role } = req.body;

        // Check if the user with the provided id already exists
        const existingUserById = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (existingUserById.rows.length > 0) {
            // If a user with the provided id already exists, return an error
            return res.status(400).json({
                success: false,
                message: 'User with the provided id already exists',
            });
        }

        // Check if the username already exists
        const existingUserByUsername = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (existingUserByUsername.rows.length > 0) {
            // If a user with the provided username already exists, return an error
            return res.status(400).json({
                success: false,
                message: 'User with the provided username already exists',
            });
        }

        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            'INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, username, email, hashedPassword, role]
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
        // ...

        // token
        const token = await JWT.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

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



module.exports = { signup, signIn };
