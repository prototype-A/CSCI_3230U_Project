// Express server
const PORT = 8000;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let uuid = require('uuid/v1');


// MongoDB
let assert = require('assert');
let bcrypt = require('bcrypt');
let db = require('./dbUtils.js');
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(db.dbUrl, { useNewUrlParser: true });


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


// Start Express listener on port
app.set('port', PORT);
app.listen(app.get('port'), function() {
	console.log('Express server started on port: ' + app.get('port'));
});