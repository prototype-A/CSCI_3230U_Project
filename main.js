// Express server
const PORT = 8000;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let uuid = require('uuid/v1');


// MongoDB
/*
let assert = require('assert');
let bcrypt = require('bcrypt');
let db = require('./dbUtils.js');
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(db.dbUrl, { useNewUrlParser: true });
*/


// Middleware
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Configure out view/templating engine (Pug)
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


// Session tracking
app.use(session({
	genid: (request) => { return uuid(); },
	resave: false,
	saveUninitialized: false,
	cookie: {
		//secure: true,
		httpOnly: false
	},
	secret: 'subcommissaries nonnavigable preamplifier denominator pseudocultural'
}));


// Main page
const HOME_PATH = '/';
app.get(HOME_PATH, (req, res) => {
	res.render('index', {
		title: 'Home',
		username: getUsername(req),
		currency: req.session.currency
	});
});


// User registration page
app.get('/register', (req, res) => {
	// Check if user is already logged in
	redirectIfLoggedIn(req, res, () => {
		res.render('registration', {
			title: 'Registration',
			currency: req.session.currency
		});
	});
});
// Validate user registration info
app.post('/register', (req, res) => {
	let response = {
		usernameErrorMessage: '',
		passwordErrorMessage: '',
		usernameResult: '',
		passwordResult: ''
	}
	
	// Check username
	if (req.body.username && req.body.username !== '') {
		//TODO: Database check
		//let userExists = db.checkUserExists(usernameToCheck).then((result) => { return result; })
		let userExists = false;
		if (userExists) {
			// User with username already exists
			response.usernameErrorMessage = 'Username is taken';
			response.usernameResult = 'rejected';
		} else {
			// Username is available
			response.usernameResult = 'accepted';
		}
	} else {
		// No username entered
		response.usernameErrorMessage = 'Please enter a username';
		response.usernameResult = 'rejected';
	}
	// Check password
	if (req.body.password && req.body.password !== '') {
		let capitalCheck = new RegExp('([A-Z])+');
		let numberCheck = new RegExp('([0-9])+');
		let passwordPassed = req.body.password.length >= 8 && capitalCheck.test(req.body.password) && numberCheck.test(req.body.password);
		if (passwordPassed) {
			// Password check passed
			passwordResult = 'accepted';
		} else {
			// Password does not meet requirements
			response.passwordErrorMessage = 'Password must contain: 1 capital letter, 1 number, and be at least 8 characters in length';
			response.passwordResult = 'rejected';
		}
	} else {
		// No password entered
		response.passwordErrorMessage = 'Password must contain: 1 capital letter, 1 number, and be at least 8 characters in length';
		response.passwordResult = 'rejected';
	}
	
	// Send response to browser
	res.send(response);
});


// User login page
const LOGIN_PATH = '/login';
app.get(LOGIN_PATH, (req, res) => {
	// Check if user is already logged in
	redirectIfLoggedIn(req, res, () => {
		res.render('login', {
			title: 'Log In',
			currency: req.session.currency
		});
	});
});
// Validate user login info
app.post(LOGIN_PATH, (req, res) => {
	//TODO: Database check
	//req.session.userId = processLogin(req.body.username, req.body.password);
	req.session.userId = 'userIdHash';
	if (req.session.userId !== null) {
		// Login successful
		req.session.username = req.body.username;
		sendRedirect(res, HOME_PATH);
	} else {
		// Login unsuccessful
		res.send({
			errorMessage: 'Username and password combination not found'
		});
	}
});


// User logout
app.get('/logout', (req, res) => {
	req.session.username = undefined;
	req.session.userId = undefined;
	redirectToHome(res);
});


// User profile
app.get('/profile', (req, res) => {
	// Check if user is logged in
	redirectIfNotLoggedIn(req, res, () => {
		//TODO: Database check
		//let user = db.getUser(req.session.userId);
		res.render('userProfile', {
			title: 'Profile',
			username: getUsername(req),
			currency: req.session.currency
			//username: user.username,
			//dateJoined: user.joinDate
		});
	});
});


// Persist browser currency change
app.post('/changeCurrency', (req, res) => {
	req.session.currency = req.body.currency;
	res.end();
});


// Send list of items to browser
app.post('/getItems', (req, res) => {
	//TODO: Retrieve from database
	let items = [
		{
			name: 'Item 1',
			condition: 'Good',
			price: 249.99,
			taxIncluded: false,
			shippingPrice: 0.99
		},
		{
			name: 'Item 2',
			condition: 'Good',
			price: 500.00,
			taxIncluded: true,
			shippingPrice: 0.00
		},
		{
			name: 'Item 3',
			condition: 'Good',
			price: 5.00,
			taxIncluded: false,
			shippingPrice: 3.99
		},
		{
			name: 'Item 4',
			condition: 'Good',
			price: 999.99,
			taxIncluded: false,
			shippingPrice: 0.00
		},
		{
			name: 'Item 5',
			condition: 'Bad',
			price: 1234567.89,
			taxIncluded: false,
			shippingPrice: 9.99
		},
		{
			name: 'Item 5',
			condition: 'Good',
			price: 1234567.89,
			taxIncluded: true,
			shippingPrice: 9.99
		},
		{
			name: 'Item 5',
			condition: 'Good',
			price: 1234567.89,
			taxIncluded: true,
			shippingPrice: 9.99
		},
	]
	res.send(items);
});


// Delete user
app.post('/deleteUser', (req, res) => {
	// Verify password first
	//TODO: Delete user from database
	//let deleteStatus = db.deleteUser(req.session.username, req.session.userId, req.body.password);
	let deleteStatus = 0;
	if (deleteStatus == 0) {
		// Correct password entered; user deleted
		sendRedirect(res, '/logout');
	} else if (deleteStatus == -1) {
		// Incorrect password
		res.send({ message: 'Password incorrect' });
	} else if (deleteStatus == -2) {
		// Server-side error occurred when deleting user
		res.send({ message: 'An error occurred when deleting the user' });
	}
});


// Start Express listener on port
app.set('port', PORT);
app.listen(app.get('port'), function() {
	console.log('Express server started on port: ' + app.get('port'));
});


// Redirects to home page if user is logged in,
// otherwise executes the callback function
function redirectIfLoggedIn(req, res, callback) {
	// Check if user is logged in
	if (req.session.username !== undefined && req.session.userId !== undefined) {
		// User is logged in
		redirectToHome(res);
	} else {
		// User is not logged in
		callback();
	}
}

// Redirects to login page if user is not logged in,
// otherwise executes the callback function
function redirectIfNotLoggedIn(req, res, callback) {
	// Check if user is logged in
	if (req.session.username === undefined && req.session.userId === undefined) {
		// User is not logged in
		redirectToLogin(res);
	} else {
		// User is logged in
		callback();
	}
}

// Returns the currently logged in user's username
function getUsername(req) {
	return req.session.username;
}

// Send redirect to browser
function sendRedirect(res, path) {
	res.send({ redirect: path });
}

// Redirect browser to home page
function redirectToHome(res) {
	res.redirect(HOME_PATH);
}

// Redirect browser to login page
function redirectToLogin(res) {
	res.redirect(LOGIN_PATH);
}