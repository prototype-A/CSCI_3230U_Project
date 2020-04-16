const dbUrl =  'mongodb://localhost:27017/CSCI_3230U_Project';
console.log('Connecting to MongoDB at: ' + dbUrl);

const collections = {
	PRODUCTS: 'products',
	USERS: 'users'
}

const userType = {
	ADMIN: 'admin',
	USER: 'user'
}

const itemCondition = {
	NEW: 'New',
	USED: 'Used',
	REFURBISHED: 'Refurbished',
	DAMAGED: 'Damaged'
}

// MongoDB
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl, { useNewUrlParser: true });
let Schema = mongoose.Schema;

// Users
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
	},
	userType: String
}, { collection: collections.USERS });
let User = mongoose.model('user', userSchema);

// Products
let productSchema = new Schema({
	name: {
		type: String,
		unique: true,
		index: true
	},
	productId: {
		type: mongoose.Types.ObjectId,
		unique: true,
		index: true
	},
	description: String,
	itemCondition: String,
	stockCount: Number,
	price: Number,
	taxIncluded: Boolean,
	shippingPrice: Number
}, { collection: collections.PRODUCTS });
let Product = mongoose.model('product', productSchema);

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
			console.log(`${username} added to ${collections.USERS}`);
		}
	});
}


// Delete user in db
function deleteUser(username, userId, passwordText) {
	User.find({
		username: username,
		userId: userId
	}).then(function(result) {
		if (result.length > 0 && bcrypt.compareSync(passwordText, result[0].pwHash)) {
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
		if (result.length > 0 && bcrypt.compareSync(passwordText, result[0].pwHash)) {
			// Login successful; return user ID to browser session
			return result[0].userId;
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
		if (result.length > 0 && bcrypt.compareSync(passwordText, result[0].pwHash)) {
			// User found
			return result[0];
		} else {
			// User not found
			return null;
		}
	});
}


// Create product
function createProduct(name, description, condition, amount, price, taxIncluded, shippingPrice) {
	let newProduct = new Product({
		name: name,
		productId: new mongoose.Types.ObjectId(),
		description: description,
		itemCondition: condition,
		stockCount: amount,
		price: price,
		taxIncluded: taxIncluded,
		shippingPrice: shippingPrice
	});
	newProduct.save((error) => {
		if (error) {
			console.error(`[ERROR] Failed to add product ${name} to collection ${collections.PRODUCTS} in database`);
		} else {
			console.log(`${name} added to ${collections.PRODUCTS}`);
		}
	});
}


// Module exports
module.exports = {
	collections,
	dbUrl,
	User,
	userType,
	Product,
	itemCondition,
	createUser,
	deleteUser,
	checkUserExists,
	processLogin,
	getUser,
	createProduct
}