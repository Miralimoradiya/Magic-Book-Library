// server-mysql-dev/routes/auth.routes.js
const express = require('express')
const { login, requestPasswordReset, verifyOtpAndChangePassword,getActiveSessions, logout, getPastSessions, refreshToken, changePassword, logoutBySessionId, registerUser, logoutOtherSessions } = require('../controllers/auth.controller')
const inputVerifier = require("../middleware/inputVerifier");
const auth = require("../middleware/auth")
const router = express.Router()

router.post('/login', inputVerifier(['email', 'password']), login)
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', verifyOtpAndChangePassword);
router.get('/sessions', auth, getActiveSessions);
router.get('/pastsessions', auth, getPastSessions);
router.post('/logout', auth, logout);
router.post('/logoutallsessions', auth, logoutOtherSessions);
router.post('/refresh-token', refreshToken);
router.post('/change-password', auth, inputVerifier(['oldPassword', 'newPassword']), changePassword);
router.post('/logout-by-session-id/:sessionId', auth, logoutBySessionId);
router.post('/register', inputVerifier(['email', 'password', 'first_name', 'last_name', 'phoneno']), registerUser);

module.exports = router