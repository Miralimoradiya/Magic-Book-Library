// server-mysql/contollers/mixed.controller.js
const { getBorrowerDataM } = require("../models/dashboardModel");

const getBorrowerData = async (req, res) => {
    try {
        let data = await getBorrowerDataM(req.query.q);
        if (data.success) return res.json({ message: data.message, data: data.data })
    } catch (error) {
        return res.status(400).json({ message: error })
    }
}

module.exports = { getBorrowerData }