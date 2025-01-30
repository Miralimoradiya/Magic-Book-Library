// server-mysql-dev/controllers/auth.controller.js
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/constants');
const { options } = require("../config/constants");
const { loginUser } = require("../models/authModel");
const { generateAccessAndRefreshToken } = require("../config/constants");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const logout = async (req, res) => {
    try {
        const userId = req.body.id;
        const sessionIdFromToken = req.user ? req.user.sessionId : null; // Check if user is defined

        if (!userId || !sessionIdFromToken) {
            return res.status(400).json({ message: 'User ID or session ID is missing' });
        }

        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;

        const sessionCheck = await query(`
            SELECT * FROM user_sessions
            WHERE user_id = ? AND id = ? AND ip_address = ? AND user_agent = ? AND is_logged_out = FALSE
        `, [userId, sessionIdFromToken, ipAddress, userAgent]);

        if (sessionCheck.length > 0) {
            // Mark the session as logged out using the sessionId from token
            const result = await query(`
                UPDATE user_sessions
                SET is_logged_out = TRUE
                WHERE id = ?
            `, [sessionIdFromToken]);

            if (result.affectedRows > 0) {
                console.log(`Session ID ${sessionIdFromToken} has been logged out for user ID: ${userId}`);
            } else {
                console.log(`No matching session found to log out for user ID: ${userId} with session ID: ${sessionIdFromToken}`);
            }
        } else {
            console.log('No active session found for user with the specified details.');
        }

        res
            .clearCookie('accessToken', options)
            .clearCookie('refreshToken', options)
            .clearCookie('user_id', options)
            .status(200)
            .json({ message: 'Successfully logged out.' });

    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'An error occurred during logout' });
    }
};

const getActiveSessions = async (req, res) => {
    try {
        const sessionid = req.user.sessionId
        const userId = req.user.id;
        const userAgent = req.headers['user-agent']; 
        const ipAddress = req.ip; 

        const sessions = await query(`
            SELECT id, ip_address, user_agent, login_timestamp 
            FROM user_sessions 
            WHERE user_id = ? AND is_logged_out = FALSE
        `, [userId]);
        
        const updatedSessions = sessions.map(session => {
            session["your_pc"] = (session.id===req.user.sessionId );
            return session;
        });

        if (updatedSessions.length > 0) {
            return res.status(200).json({ message: 'Active sessions', sessions: updatedSessions });
        } else {
            return res.status(404).json({ message: 'No active sessions found' });
        }
    } catch (error) {
        console.error('Error fetching active sessions:', error);
        return res.status(500).json({ message: 'An error occurred while fetching sessions' });
    }
};

const getPastSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        await query(`
            DELETE FROM user_sessions 
            WHERE user_id = ? 
              AND is_logged_out = TRUE 
              AND login_timestamp < NOW() - INTERVAL 30 DAY
        `, [userId]);
        const sessions = await query(`
            SELECT ip_address, user_agent, login_timestamp 
            FROM user_sessions 
            WHERE user_id = ? 
              AND is_logged_out = TRUE 
              AND login_timestamp >= NOW() - INTERVAL 3 DAY
        `, [userId]);
        if (sessions.length > 0) {
            return res.status(200).json({ message: 'Active sessions', sessions });
        } else {
            return res.status(404).json({ message: 'No active sessions found' });
        }
    } catch (error) {
        console.error('Error fetching active sessions:', error);
        return res.status(500).json({ message: 'An error occurred while fetching sessions' });
    }
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { id, email, role, sessionId } = decoded;
        const users = await query('SELECT * FROM tbl_user WHERE user_id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateAccessAndRefreshToken(id, email, role, sessionId);
        await query('UPDATE tbl_user SET refresh_token = ? WHERE user_id = ?', [newRefreshToken, id]);

        return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const loggedInUser = await loginUser(email, password, req);
    if (loggedInUser.success) {
        return res
            .cookie('accessToken', loggedInUser.accessToken, options)
            .cookie('refreshToken', loggedInUser.refreshToken, options)
            .cookie('user_id', loggedInUser.data.id, options)
            .status(200)
            .json({
                email,
                accessToken: loggedInUser.accessToken,
                refreshToken: loggedInUser.refreshToken,
                email: loggedInUser.data.email,
                role: loggedInUser.data.role,
                first_name: loggedInUser.data.first_name,
                last_name: loggedInUser.data.last_name,
                id: loggedInUser.data.id,
                profile_image: loggedInUser.data.profile_image,
                perms: loggedInUser.data.perms,
            });
    } else {
        return res.status(400).json({ message: loggedInUser.message });
    }
};

const sendOtpToEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"magicbooklibrary" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP',
            html: `
    <html>
        <body>
            <div style="text-align: center">
                <h1>Password Reset Request</h1>
                <br /> 
                <p>This mail is sent by mirali moradiya for library managemnt project. Use the OTP below for forget password:</p>
                <br /> <br />
                <h1 style="font-size: 30px; font-weight: bold; color: rgb(35, 38, 233) ">${otp}</h1>
                <p>The OTP will expire in 30 seconds. Use it quickly!</p>
                <div>
                    <p>If you did not request a reset, please ignore this email or <a href="#">contact support</a>.</p>
                    <p>Thank you!</p>
                </div>
            </div>
        </body>
    </html>
`
        };
        await transporter.sendMail(mailOptions);
        console.log('OTP sent to email:', email);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP');
    }
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await query('SELECT * FROM tbl_user WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);

        const otpExpiry = Date.now() + 60 * 1000;
        await query('UPDATE tbl_user SET otp = ?, otp_expiry = ? WHERE email = ?', [otp, otpExpiry, email]);

        await sendOtpToEmail(email, otp);

        return res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Error in password reset request:', error);
        return res.status(500).json({ message: 'Error in password reset request' });
    }
};

const verifyOtpAndChangePassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const users = await query('SELECT * FROM tbl_user WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        if (user.otp !== otp || Date.now() > user.otp_expiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await query('UPDATE tbl_user SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?', [hashedPassword, email]);

        return res.status(200).json({ message: 'Password successfully changed' });

    } catch (error) {
        console.error('Error verifying OTP and changing password: ', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const sessionIdFromToken = req.user.sessionId; 

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required' });
    }
    if (oldPassword === newPassword) {
        return res.status(400).json({ message: 'Old and new passwords cannot be the same' });
    }
    try {
        const users = await query('SELECT * FROM tbl_user WHERE user_id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await query('UPDATE tbl_user SET password = ? WHERE user_id = ?', [hashedPassword, userId]);

        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;

       // Flag all other active sessions as having changed password
       await query(`
          UPDATE user_sessions 
            SET is_password_changed = 1, is_logged_out = 1
            WHERE user_id = ? 
            AND id != ? 
            AND is_logged_out = 0
    `, [userId, sessionIdFromToken]);

    return res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ message: 'An error occurred while changing the password' });
    }
};

const logoutBySessionId = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const sessionCheck = await query(`
            SELECT * FROM user_sessions
            WHERE id = ? AND is_logged_out = FALSE
        `, [sessionId]);

        if (sessionCheck.length === 0) {
            return res.status(404).json({ message: 'Session not found or already logged out' });
        }

        const session = sessionCheck[0];
        const userId = session.user_id;

        // Update session status: set is_logged_out, is_password_changed, and is_loggedout_by_id to 1
        const result = await query(`
            UPDATE user_sessions
            SET is_logged_out = TRUE, is_loggedout_by_id = TRUE
            WHERE id = ?
        `, [sessionId]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Session successfully logged out, and password change flagged' });
        } else {
            return res.status(500).json({ message: 'Failed to log out session or update password change flag' });
        }

    } catch (error) {
        console.error('Error during logout by session ID:', error);
        return res.status(500).json({ message: 'An error occurred during logout' });
    }
};

const registerUser = async (req, res) => {
    const { email, password, confirm_password, first_name, last_name, phoneno } = req.body;

    try {
        // Check if user already exists
        const existingUser = await query('SELECT * FROM tbl_user WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if passwords match
        if (password !== confirm_password) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await query(`
            INSERT INTO tbl_user (email, password, first_name, last_name, phoneno, role, isDeleted, profile_image, otp, otp_expiry)
            VALUES (?, ?, ?, ?, ?, 'student', 0, NULL, NULL, NULL)
        `, [email, hashedPassword, first_name, last_name, phoneno]);

        if (result.affectedRows === 1) {
            return res.status(201).json({
                message: 'User registered successfully',
                data: {
                    email,
                    first_name,
                    last_name,
                    phoneno
                }
            });
        } else {
            return res.status(500).json({ message: 'Error occurred while registering the user' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'An error occurred during registration' });
    }
};


const logoutOtherSessions = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the authenticated request
        const sessionId = req.user.sessionId; // Extract current session ID from token
        console.log("Extracted User ID:", userId);
        console.log("Extracted Session ID:", sessionId);
        
        if (!userId || !sessionId) {
            return res.status(400).json({ message: 'Invalid user session' });
        }

        // Find all active sessions for the user except the one with 'Your PC'
        const sessions = await query(
            `SELECT id FROM user_sessions WHERE user_id = ? AND id != ? AND is_logged_out = FALSE AND user_agent NOT LIKE '%Your PC%'`,
            [userId, sessionId]
        );

        if (sessions.length === 0) {
            return res.status(200).json({ message: 'No other active sessions to log out' });
        }

        const sessionIdsToLogout = sessions.map(session => session.id);
        
        // Mark selected sessions as logged out
        const result = await query(
            `UPDATE user_sessions SET is_logged_out = TRUE, is_loggedout_by_id = TRUE WHERE id IN (?)`,
            [sessionIdsToLogout]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Logged out ${result.affectedRows} sessions except 'Your PC' session.` });
        } else {
            return res.status(500).json({ message: 'Failed to log out other sessions' });
        }
    } catch (error) {
        console.error('Error logging out other sessions:', error);
        return res.status(500).json({ message: 'An error occurred while logging out other sessions' });
    }
};
module.exports = { login, requestPasswordReset, verifyOtpAndChangePassword, getActiveSessions, logout, getPastSessions, refreshToken, changePassword, logoutBySessionId, registerUser, logoutOtherSessions }
