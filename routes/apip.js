const express = require('express');
const mysql = require('mysql2'); // Import mysql
const router = express.Router();

// Define the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'fact_stack_app', // Adjust username if needed
    password: 'qwertyuiop', // Adjust password if needed
    database: 'fact_stack'  // Adjust database name if needed
});

// Handle database connection errors
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Define the /factlist route
router.get('/factlist', function (req, res) {
    let sqlquery = "SELECT * FROM saved_facts";

    db.query(sqlquery, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(result);
    });
});

module.exports = router;
