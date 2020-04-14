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
	//cookie: { secure: true },
	secret: 'subcommissaries nonnavigable preamplifier denominator pseudocultural'
}));


// Main page
/*
app.get('/', (req, res) => {
	let session = req.session;
	let username = '';
	if (session.username) {
		username = session.username;
	}
	response.render('index', {
		title: '',
		description: '',
		username: username
	});
});
*/
app.get('/', (req, res) => {
	res.redirect('/register');
});


// User registration page
const userRegistrationTitle = 'Registration';
const registrationTemplate = 'registration';
app.get('/register', (req, res) => {
	res.render(registrationTemplate, {
		title: userRegistrationTitle
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


// Start Express listener on port
app.set('port', PORT);
app.listen(app.get('port'), function() {
	console.log('Express server started on port: ' + app.get('port'));
});