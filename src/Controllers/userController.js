const pool = require('../../Config/dbConnect');
const { hashPassword, comparePassword, generateSerialNumber, generateOTP } = require("../../helper/authHelper");
const JWT = require("jsonwebtoken")
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sksatenderkumar59@gmail.com",
        pass: "fkmi ifgb yekk cihi"
    }
});

const sendMail = async (to, subject, text) => {
    const info = {
        from: "Trimaster Private limited <sksatenderkumar59@gmail.com>",
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(info);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error in sending mail:", error);
    }
};



const signup = async (req, res) => {
    let newUser = null;

    try {
        const { username, fname, lname, email, department, organization, phone, password, } = req.body;
        const uniqueNumber = generateSerialNumber();
        const { otp, currentTime } = generateOTP();

        const requiredFields = [
            "username", "fname", "lname", "email",
            "department", "organization", "phone", "password",
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        const existingUserByUsername = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (existingUserByUsername.rows.length > 0) {
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

        // Store the OTP and user details in the database
        const result = await pool.query(
            'INSERT INTO users (employeid, username, fname, lname, email, department, organization, phone, password, otp, otp_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [uniqueNumber, username, fname, lname, email, department, organization, phone, hashedPassword, otp, currentTime]
        );

        newUser = result.rows[0];

        // Sending OTP to the user's email
        const emailSubject = 'OTP for Registration';
        const emailText = `Dear ${fname},\n\nYour OTP for registration is: ${otp}.`;

        await sendMail(newUser.email, emailSubject, emailText);

        res.status(201).json({
            success: true,
            message: 'OTP sent successfully. Check your email to verify registration.',
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ------------------------------------------OTP-Verify----------------------------------------------//
const otpVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Fetch user by email
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const storedOTP = user.rows[0].otp;
        const otpTime = user.rows[0].otp_time;
        const currentTime = new Date().toISOString();

        console.log('Current Time:', currentTime);
        console.log('OTP Time:', otpTime);

        // Compare OTP only
        if (otp === storedOTP) {
            await pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email]);

            return res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
            });
        } else {
            console.log('Verification failed: Incorrect OTP', otp, storedOTP);

            return res.status(400).json({
                success: false,
                message: 'Incorrect OTP',
            });
        }
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
                data: user.rows[0]
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

module.exports = { signup, signIn, tokenVerify, otpVerify };
