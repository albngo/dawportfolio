// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

// Middleware function to check if the user is logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./');
        }
        // After destroying the session, redirect to the logged-out page
        res.redirect('/logged-out');
    });
});

// Logged Out page route
router.get('/logged-out', (req, res) => {
    res.render('logged-out'); // Render the 'logged-out.ejs' page
});


// Export the router object so index.js can access it
module.exports = router;
