// server-mysql/index.js
require("dotenv").config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const librarianRoutes = require('./routes/librarian.routes')
const studentRoutes = require('./routes/student.routes')
const commonRoutes = require('./routes/common.routes')
const auth = require("./middleware/auth");
const perms = require('./middleware/perms-check')
const cors = require('cors');
const passport = require("passport");
const { options } = require("./config/constants");
require('./config/google-strategy')
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(cookieParser());

app.get('/auth/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/test' }),
    (req, res) => {
        const { refreshToken, accessToken } = req.user
        res
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
        res.redirect('/success');
    });

app.get('/test', (_, res) => {
    return res.json({ message: "Library = Express + MYSQL" })
})
app.get('/success', (_, res) => {
    return res.json({ message: "NICE" })
})

app.use('/auth', authRoutes)
app.use(auth)
app.use('/common', perms, commonRoutes)
app.use('/l', perms, librarianRoutes)
app.use('/s', perms, studentRoutes)
app.use('/user', userRoutes)

app.get('/', (_, res) => {
    try {
        return res.json({ message: "Library = Express + MYSQL" })
    } catch (error) {
        return res.json({ message: error })
    }
})

try {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
} catch (error) {
    console.log(error)
}