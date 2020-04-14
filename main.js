// Express server
const PORT = 8000;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let uuid = require('uuid/v1');


// MongoDB
let assert = require('assert');
let bcrypt = require('bcrypt-nodejs');
let mongoose = require('mongoose');
mongoose.Promise = globa.Promise;
mongoose.connect('mongodb://localhost:27017/', { userNewUrlParser: true });

let Schema = mongoose.Schema;
let userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		index: true
	},
	pwHash: String
}, { collection: 'users' });
let User = mongoose.model('user', userSchema);


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
	saveUnitialized: false,
	cookie: { secure: true },
	secret: 'apollo slackware prepositional expectations'
});


// Start Express listener on port
app.set('port', PORT);
app.listen(app.get('port'), function() {
	console.log('Express server started on port: ' + app.get('port'));
});