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