// server-mysql/config/google-strategy.js
const { findUserByMail } = require('../models/authModel');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await findUserByMail(profile._json.email)
            if (user.success) {
                return done(null, { email: user.data.email, accessToken: user.data.accessToken, refreshToken: user.data.refreshToken, perms: user.data.perms, id: user.data.id, role: user.data.role })
            }
            return done(user.message)
        } catch (error) {
            return done(error)
        }
    }
));