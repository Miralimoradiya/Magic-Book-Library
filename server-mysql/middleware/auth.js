// server-mysql-dev/middleware/auth.js
const jwt = require('jsonwebtoken');
const { whiteListedAPIs } = require('../config/constants');
const { query } = require('../config/constants');

const auth = async (req, res, next) => {
    if (whiteListedAPIs.includes(req.path)) return next();

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;

        const userId = decoded.id;
        const sessionIdFromToken = decoded.sessionId;

        if (!sessionIdFromToken) {
            return res.status(400).json({ message: 'Session ID is missing in token' });
        }

        const sessionCheck = await query(`
            SELECT is_password_changed, is_logged_out 
            FROM user_sessions 
            WHERE user_id = ? AND id = ? 
            AND is_logged_out = FALSE
            AND is_password_changed = 0
        `, [userId, sessionIdFromToken]);

        if (sessionCheck.length === 0) {
            return res.status(403).json({ message: 'Your password has been changed. Please log in again.' });
        }

        const sessionStatus = sessionCheck[0];
        if (sessionStatus.is_password_changed === 1) {
            return res.status(403).json({ message: 'Your password has been changed. Please log in again.' });
        }

        next();

    } catch (error) {
        console.error('Error during token verification:', error);
        if (error.name === 'TokenExpiredError') {
            const refreshToken = req.body.refreshToken || req.query.refreshToken || req.headers['x-refresh-token'];

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token required' });
            }

            try {
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const { user_id, email, role,sessionId } = decodedRefreshToken;

                const users = await query(`SELECT * FROM tbl_user WHERE user_id = ?`, [user_id]);

                if (users.length === 0) {
                    return res.status(401).json({ message: 'User not found' });
                }

                // Generate a new access token
                const { accessToken, refreshToken: newRefreshToken } = generateAccessAndRefreshToken(user_id, email, role,sessionId);

                // Optionally update the refresh token in the database if needed
                await query('UPDATE tbl_user SET refresh_token = ? WHERE user_id = ?', [newRefreshToken, user_id]);

                // Return the new tokens to the client
                res.setHeader('Authorization', `Bearer ${accessToken}`);
                req.user = { user_id, email, role,sessionId };
                return next();

            } catch (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }
        }
        res.status(401).json({ message: 'Invalid or expired access token' });
    }
};
module.exports = auth;