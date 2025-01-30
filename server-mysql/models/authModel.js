// server-mysql-dev/models/authModel.js
const { generateAccessAndRefreshToken, query } = require("../config/constants");
const bcrypt = require("bcryptjs");

const loginUser = async (email, password, req) => {
    try {
        const users = await query(`
            SELECT * FROM tbl_user
            WHERE email = ?
        `, [email]);
        if (users.length === 0) {
            return { success: false, message: 'No such user' };
        }
        if (users.length > 0 && !users[0].isDeleted) {
            const user = users[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const userAgent = req.headers['user-agent'];
                const ipAddress = req.ip; 
                const sessionInsertResult = await query(`
                    INSERT INTO user_sessions (user_id, ip_address, user_agent)
                    VALUES (?, ?, ?)
                    `, [user.user_id, ipAddress, userAgent]);
                    console.log('Session inserted:', sessionInsertResult);
                    const { accessToken, refreshToken } = generateAccessAndRefreshToken(
                        user.user_id,
                        user.email,
                        user.role,
                        sessionInsertResult.insertId
                    );

                const refreshTokenUpdate = await query(`
                    UPDATE tbl_user
                    SET refresh_token = ?
                    WHERE email = ?
                `, [refreshToken, email]);
                if (refreshTokenUpdate.affectedRows === 1) {
                    return {
                        success: true,
                        message: 'login success',
                        accessToken,
                        refreshToken,
                        data: {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            id: user.user_id,
                            email: user.email,
                            role: user.role,
                            perms: user.perms.split(','),
                            profile_image: user.profile_image 
                        }
                    };
                } else {
                    return {
                        success: false,
                        message: 'some error occurred'
                    };
                }
            } else {
                return { success: false, message: 'Invalid Password', data: null };
            }
        } else {
            return { success: false, message: 'No such user' };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, message: 'An error occurred during login', error };
    }
};

const findUserByMail = async (email) => {
    try {
        const [user] = await query(`
             SELECT * FROM tbl_user
             WHERE tbl_user.email = ?
         `, [email])
        if (user) {
            const { accessToken, refreshToken } = generateAccessAndRefreshToken(
                user.user_id,
                user.email,
                user.role
            );
            const refreshTokenUpdate = await query(`
                UPDATE tbl_user
                SET refresh_token = ?
                WHERE email = ?
            `, [refreshToken, email]);
            if (refreshTokenUpdate.affectedRows === 1) {
                return {
                    success: true,
                    message: 'login success',
                    data: { role: user.role, perms: user.perms, id: user.user_id, email: user.email, accessToken, refreshToken }
                };
            }
            return { success: false, message: 'some issue!', data: null }
        } return { success: false, message: 'not found', data: null }
    } catch (error) {
        return { success: false, message: error, data: null }
    }
}

module.exports = { loginUser, findUserByMail };