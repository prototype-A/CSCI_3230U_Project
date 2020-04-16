// Express server
const PORT = 8000;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let uuid = require('uuid/v1');


// MongoDB
let db = require('./dbTools.js');
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(db.dbUrl, { useNewUrlParser: true });
let assert = require('assert');
let bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

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
	if (req.body.username !== '' && req.body.username !== undefined) {
		db.User.find({
			username: req.body.username
		}).then(function(result) {
			if (result.length > 0) {
				// User with username already exists
				response.usernameErrorMessage = 'Username is taken';
				response.usernameResult = 'rejected';
			} else {
				// Username is available
				response.usernameResult = 'accepted';
			}

			// Check password
			if (req.body.password !== '' && req.body.password !== undefined) {
				let capitalCheck = new RegExp('([A-Z])+');
				let numberCheck = new RegExp('([0-9])+');
				let passwordPassed = req.body.password.length >= 8 && capitalCheck.test(req.body.password) && numberCheck.test(req.body.password);
				if (passwordPassed) {
					// Password check passed
					response.passwordResult = 'accepted';
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
			
			if (response.usernameResult === response.passwordResult && response.usernameResult === 'accepted') {
				// Username and password passed; create user
				let passwordHash = bcrypt.hashSync(req.body.password, salt);
				let userId = new mongoose.Types.ObjectId();

				let newUser = new db.User({
					username: req.body.username,
					pwHash: passwordHash,
					joinDate: Date.now(),
					userId: userId,
					userType: db.userType.USER
				});
				newUser.save((error) => {
					if (error) {
						console.error(`[ERROR] Failed to add user ${req.body.username} to collection ${db.collections.USERS} in database`);
					} else {
						console.log(`${req.body.username} added to ${collections.USERS}`);
					}
				});
				
				// Log in to user
				req.session.username = req.body.username;
				req.session.userId = userId;
				
				sendRedirect(res, '/');
			} else {
				// Send errors back to browser
				res.send(response);
			}
		});
	} else {
		// No username entered
		response.usernameErrorMessage = 'Please enter a username';
		response.usernameResult = 'rejected';

		res.send(response);
	}
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
	db.User.find({
		username: req.body.username
	}).then(function(result) {
		if (result.length > 0 && bcrypt.compareSync(req.body.password, result[0].pwHash)) {
			// Login successful; return user ID to browser session
			req.session.userId = result[0].userId;
			req.session.username = result[0].username;
			sendRedirect(res, HOME_PATH);
		} else {
			// Login unsuccessful
			res.send({
				errorMessage: 'Username and password combination not found'
			});
		}
	});
	
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
		db.User.find({
			userId: req.session.userId
		}).then(function(result) {
			if (result.length > 0) {
				// User found
				let user = result[0];
				res.render('userProfile', {
					title: 'Profile',
					currency: req.session.currency,
					username: user.username,
					dateJoined: user.joinDate.toString()
				});
			}
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
	db.Product.find({
		name: {
			$regex: new RegExp(req.body.keyword, 'i')
		}
	}).then(function(result) {
		res.send(result);
	});
});


// Delete user
app.post('/deleteUser', (req, res) => {
	// Verify password first
	//TODO: Delete user from database
	db.User.find({
		username: req.session.username,
		userId: req.session.userId
	}).then(function(result) {
		if (result.length > 0 && bcrypt.compareSync(req.body.password, result[0].pwHash)) {
			// User found; deleting
			db.User.remove({
				username: req.session.username,
				userId: req.session.userId,
			}, (error) => {
				if (error) {
					console.error(`[ERROR] Failed to delete user ${req.session.username} (${req.session.userId})`);
					res.send({ message: 'An error occurred when deleting the user' });
				} else {
					// Successfully deleted user; log out and redirect home
					sendRedirect(res, '/logout');
				}
			});
		} else {
			// Incorrect password
			res.send({ message: 'Password incorrect' });
		}
	});
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