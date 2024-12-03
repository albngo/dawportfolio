// Import express and ejs
var express = require('express');
const { getFunFact } = require('./routes/api');
var ejs = require('ejs');

// Import mysql module
var mysql = require('mysql2');

//Import the express-session module
var session = require ('express-session');

//Import the express-validator module
var validator = require ('express-validator');

//Import the express-sanitizer module
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.json()); // For parsing JSON requests


//Create the fun fact api app
app.get('/facts', async (req, res) => {
    const funFact = await getFunFact();
    res.render('facts', { funFact });
});

// Create an input sanitizer
app.use(expressSanitizer());

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));

// Set up the express-session
// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Set up public folder (for css and static js)
app.use(express.static(__dirname + '/public'));

// Define the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'fact_stack_app', //this is the username of the root user, we can change it to anything after but make sure to change in the db.sql file too
    password: 'qwertyuiop', //change this to any password  but make sure you change it in the db.sql files too
    database: 'fact_stack' //this is the db name, make sure you change it in the db.sql files too
});

// Connect to the database
db.connect(function (err) {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log('Connected to database' + db.config.database);
});
global.db = db;

// Define our application-specific data
app.locals.shopData = { shopName: "Fact Stack" }; //this is the name of the shop, we will change it later when we find our project idea

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Load the route handlers for /users
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Reroll route
app.get('/reroll', async (req, res) => {
    const funFact = await getFunFact();
    res.render('facts', { funFact });
});

// Middleware to ensure user is logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        next();
    }
};

// Facts route (where users can submit a new fact)
app.get('/facts', redirectLogin, (req, res) => {
    res.render('submit_fact');
});

// Show saved facts (GET route)
app.get('/facts/saved', redirectLogin, (req, res) => {
    const userId = req.session.userId;

    // SQL query to get saved facts with a formatted date
    const sql = 'SELECT id, fact, DATE_FORMAT(created_at, "%Y-%m-%d") AS formatted_date FROM saved_facts WHERE user_id = ? ORDER BY created_at DESC';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving saved facts:', err);
            return res.send('Error retrieving saved facts');
        }

        // Pass the results (saved facts) to the saved_facts.ejs view
        console.log(results); // Log to check the data structure
        res.render('saved_facts', { savedFacts: results });
    });
});


// Save a fact (POST route)
app.post('/facts/saved', redirectLogin, (req, res) => {
    const userId = req.session.userId;
    const fact = req.body.fact; // Assuming the fact is passed in the body as 'fact'
    console.log('Fact received from form:', req.body.fact); // Log the fact to ensure it is being received correctly
    
    // SQL query to insert the fact into the database
    const sql = 'INSERT INTO saved_facts (user_id, fact) VALUES (?, ?)';
    db.query(sql, [userId, fact], (err, result) => {
        if (err) {
            console.error('Error saving fact:', err);
            return res.send('Error saving fact');
        }

        // Redirect to the saved facts page after saving
        res.redirect('saved');
    });
});

app.get('/facts/saved/search', redirectLogin, (req, res) => {
    const userId = req.session.userId;
    const searchQuery = `%${req.query.keyword}%`; // Retrieve keyword from the query string

    const sql = 'SELECT * FROM saved_facts WHERE user_id = ? AND fact LIKE ? ORDER BY created_at DESC';
    db.query(sql, [userId, searchQuery], (err, results) => {
        if (err) {
            console.error('Error searching facts:', err);
            return res.send('Error searching facts');
        }
        res.render('saved_facts', { savedFacts: results });
    });
});

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`));