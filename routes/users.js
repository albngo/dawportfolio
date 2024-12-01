// Initialize express-validator
const { check, validationResult } = require('express-validator');

// Create a new router
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const saltRounds = 10;

// Middleware function to check if the user is logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // redirect to the login page
    } else {
        next(); // move to the next middleware function
    }
};

// Route for registration
router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

router.post('/registered', [
    // Validation and sanitization using express-validator
    check('email').isEmail().normalizeEmail(), // Normalize the email
    check('username').trim().escape(), // Sanitize username
    check('first').trim().escape(), // Sanitize first name
    check('last').trim().escape() // Sanitize last name
], function (req, res, next) {
    // Validate the input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('./register'); // Redirect if validation fails
    }

    // Get the sanitized input data
    const plainPassword = req.body.password;
    const userName = req.body.username;
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;

    // Check if the email or username already exists in the database
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(checkQuery, [email, userName], function (err, results) {
        if (err) {
            return next(err); // Handle error
        }

        if (results.length > 0) {
            // Email or username already exists
            return res.send('This email or username is already taken. Please choose another one.');
        }

        // Hash the plain password using bcrypt
        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
            if (err) {
                return next(err); // Handle error
            }

            // Store the user data in the database
            const sql = 'INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?, ?, ?, ?, ?)';
            console.log('Form Data:', req.body); // Log the form data to confirm it was received
            console.log('Sanitized Data:', userName, firstName, lastName, email); // Log the sanitized data

            db.query(sql, [userName, firstName, lastName, email, hashedPassword], function (err, result) {
                if (err) {
                    console.error('Error executing query:', err); // Log any errors
                    return next(err); // Handle error
                }

                // Prepare and send a response to the user
                console.log('User inserted:', result); // Log the result to confirm the query executed successfully
                let resultResponse = `Hello ${firstName} ${lastName}, you are now registered! We will send an email to you at ${email}  <a href='/'>Home</a>`;
                res.send(resultResponse);
            });
        });
    });
});

// Route for login
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

// Route to display the logged-in dashboard
router.get('/loggedin', redirectLogin, function (req, res) {
    const userName = req.session.userName; // Retrieve the username from the session

    if (userName) {
        res.render('loggedin', { username: userName }); // Render the page with the username
    } else {
        res.redirect('/users/login'); // Redirect to login if session data is missing
    }
});

// Route to handle login logic
router.post('/loggedin', function (req, res, next) {
    const userName = req.sanitize(req.body.username); // Sanitize the username
    const password = req.sanitize(req.body.password); // Sanitize the password

    // Select the hashed password for the user from the database
    const sql = 'SELECT id, username, hashedPassword FROM users WHERE username = ?';
    db.query(sql, [userName], function (err, results) {
        if (err) {
            return next(err); // Handle error
        }

        // Check if user exists
        if (results.length > 0) {
            const hashedPassword = results[0].hashedPassword;
            const userId = results[0].id; // Get user ID

            // Compare the supplied password with the hashed password in the database
            bcrypt.compare(password, hashedPassword, function (err, result) {
                if (err) {
                    return next(err); // Handle error
                }

                if (result === true) {
                    // Save user session when login is successful
                    req.session.userId = userId; // Store the user ID in session
                    req.session.userName = userName; // Store the username in session
                    
                    // Render the loggedin page with the username
                    res.redirect('/users/loggedin'); // Redirect to the dashboard route
                } else {
                    // Send failure message for incorrect password
                    res.send('Login failed! Incorrect username or password.');
                }
            });
        } else {
            // User does not exist
            res.send('Login failed! Incorrect username or password.');
        }
    });
});

// Export the router object so index.js can access it
module.exports = router;
