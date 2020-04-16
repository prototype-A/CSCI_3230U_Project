let db = require('./dbTools.js');

// Create Users
db.createUser('admin', 'admin', db.userType.ADMIN);
db.createUser('user', 'user', db.userType.USER);

// Create products
db.createProduct('Item 1', 'Description of item 1', db.itemCondition.NEW, 50, 4.99, false, 2.99);
db.createProduct('Item 2', 'Description of item 2', db.itemCondition.NEW, 17, 9.99, false, 2.99);
db.createProduct('Item 3', 'Description of item 3', db.itemCondition.NEW, 25, 19.99, false, 1.99);
db.createProduct('Item 4', 'Description of item 4', db.itemCondition.NEW, 48, 24.99, false, 1.99);
db.createProduct('Item 5', 'Description of item 5', db.itemCondition.NEW, 100, 30.00, true, 0.00);
db.createProduct('Complementary Item', 'Free item!', db.itemCondition.NEW, 0, 0.00, true, 3.99);
db.createProduct(
	'Extreme Test Item',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	db.itemCondition.NEW,
	3,
	3999.99,
	false,
	9999.99);
db.createProduct(
	'Extreme Ultra Super Test Item',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	db.itemCondition.NEW,
	1,
	999999.99,
	false,
	999999.99);

// Insert currency exchange rates
db.addCurrency('Canadian Dollar', 'CAD', 1);
db.addCurrency('Euro', 'EUR', 0.66);
db.addCurrency('Great Britain Pound', 'GBP', 0.57);
db.addCurrency('Japanese Yen', 'JPY', 76.92);
db.addCurrency('USA Dollar', 'USD', 0.71);