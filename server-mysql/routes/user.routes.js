// server-mysql/routes/user.routes.js
const express = require('express')
const { getBorrowerData } = require('../controllers/mixed-user.controller')
const router = express.Router()

router.get('/available-books', getBorrowerData)

module.exports = router