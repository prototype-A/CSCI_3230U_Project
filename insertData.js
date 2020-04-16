let db = require('./dbTools.js');

// Create Users
db.createUser('admin', 'admin', db.userType.ADMIN);
db.createUser('user', 'user', db.userType.USER);

// Create products
db.createProduct('Item 1', db.itemCondition.NEW, 4.99, false, 2.99);
db.createProduct('Item 2', db.itemCondition.NEW, 9.99, false, 2.99);
db.createProduct('Item 3', db.itemCondition.NEW, 19.99, false, 1.99);
db.createProduct('Item 4', db.itemCondition.NEW, 24.99, false, 1.99);
db.createProduct('Item 5', db.itemCondition.NEW, 30.00, true, 0.00);
db.createProduct('Complementary Item', db.itemCondition.NEW, 0.00, true, 3.99);