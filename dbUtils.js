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
	joinDate: Date,
	pwHash: String,
	userId: {
		type: mongoose.Types.ObjectId,
		unique: true,
		index: true
	userType: String
}, { collection: collections.USERS });
let User = mongoose.model('user', userSchema);


// Hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


// Create user in db
function createUser(username, passwordText, userType) {
	let passwordHash = bcrypt.hashSync(passwordText, salt);
	
	let newUser = new User({
		username: username,
		pwHash: passwordHash,
		joinDate: Date.now(),
		userId: new mongoose.Types.ObjectId(),
		userType: userType
	});
	newUser.save((error) => {
		if (error) {
			console.error(`[ERROR] Failed to add user ${username} to collection ${collections.USERS} in database`);
		} else {
			console.log(`${username} added to users`);
		}
	});
}


// Delete user in db
function deleteUser(username, userId, passwordText) {
	User.find({
		username: username,
		userId: userId
	}).then(function(result) {
		if (result.length > 0 && bcrypt.compareSync(passwordText, users[0].pwHash)) {
			// User found; deleting
			User.remove({
				username: username,
				userId: userId,
			}, (error) => {
				if (error) {
					console.error(`[ERROR] Failed to delete user ${username}`);
					return -2;
				} else {
					return 0;
				}
			});
		} else {
			// Incorrect password
			return -1;
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


// Log in to user
function processLogin(username, passwordText) {
	User.find({
		username: username
	}).then(function(result) {
		if (result.length > 0 && bcrypt.compareSync(passwordText, users[0].pwHash)) {
			// Login successful; return user ID to browser session
			return users[0].userId;
		} else {
			// Login failed
			return null;
		}
	});
}


// Find user object in db by userId
function getUser(userId) {
	User.find({
		userId: userId
	}).then(function(result) {
		if (result.length > 0 && bcrypt.compareSync(passwordText, users[0].pwHash)) {
			// User found
			return users[0];
		} else {
			// User not found
			return null;
		}
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