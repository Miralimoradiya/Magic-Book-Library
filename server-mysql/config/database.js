// server-mysql/config/database.js
require("dotenv").config();
const mysql = require('mysql');

const pool = mysql.createPool({
    host: "localhost",
    port: process.env.DB_PORT,
    user: "root",
    password: "",
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0    
});

// Test the connection immediately after creating the pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        return;
    }
    if (connection) {
        console.log("Successfully connected to the database");
        connection.release(); 
    }
});

module.exports = { pool };
