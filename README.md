# CSCI 3230U Project
Web Development Final Project  
A simple e-commerce website with basic functionalities
  
## Group Members:
Alex Zheng  
Andre Dallaire
  
  
## Getting Started
### Pre-requisites
* Node.js
* MongoDB
  
### Sample data
* Run `node .\insertData.js` to create sample data for the website in MongoDB
* Creates 2 users (admin:admin, user:user)
* Creates some sample products
* Inserts some other misc data, such as CAD currency conversion rates
  
### Running the web server
* Run `npm install` to download required node_modules
* Run `node main.js` to start the web server
* Navigate to "localhost:8000" in your web browser
  
  
### Notes/Issues/Todo
* Conversion rates are retrieved as of 5:45pm, Apr. 16, 2020
* Selected currency persists visually in browser but does not save converted prices nor retrieve item prices in that currency
* Shopping cart is not functional
* No checkout functionality