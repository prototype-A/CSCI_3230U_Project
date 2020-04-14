const dbUrl =  'mongodb://localhost:27017/CSCI_3230U_Project';
console.log('Connecting to MongoDB at: ' + dbUrl);

const userType = {
	ADMIN: 'admin',
	USER: 'user'
}

const collections = {
	USERS: 'users'
}


// MongoDB
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl, { useNewUrlParser: true });

let Schema = mongoose.Schema;
let userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		index: true
	},
	id: mongoose.Types.ObjectId,
	pwHash: String,
	type: String
}, { collection: collections.USERS });
let User = mongoose.model('user', userSchema);


// Hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


// Create user in db
function createUser(username, password, userType) {
	let passwordHash = bcrypt.hashSync(password, salt);
	
	let newUser = new User({
		username: username,
		pwHash: passwordHash,
		id: new mongoose.Types.ObjectId(),
		type: userType
	});
	newUser.save((error) => {
		if (error) {
			console.error(`[ERROR] Failed to add user ${username} to collection ${collections.USERS} in database`);
		} else {
			console.log(`${username} added to users`);
		}
	});
}


// Check if user exists in db
function checkUserExists(username) {
	User.find({ username: username }).then(function(result) {
		return (result.length > 0) ? true : false;
	}).then(function(result) {
		return result;
	});
}


// Module exports
module.exports = {
	collections,
	dbUrl,
	User,
	userSchema,
	userType
}