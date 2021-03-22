# task-manager-api

This repository contains the backend code for creating a simple task manager like functionality that supports multiple users as well. The entire application has been written in Node.js.

This project uses the following packages for implementing the functionalities required:

[multer](https://www.npmjs.com/package/multer) - A package to upload and send files to the backend service. Used here for uploading profile images for different users.

[bcrypt.js](https://www.npmjs.com/package/bcryptjs) - It is a password hashing function to encrypt the password before performing any other operation on it. Here this package has been used
to encrypt the password before saving it in the database.

[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Ap package to create a unique token to correctly identify each user. Here it is generated for each user when the user signs up
and then it is used to verify the identity of the user on each subsequent api request. It is also used to send the appropriate data related to each user on request thus guaranteeing 
one user cannot see the data of another user.

[sharp](https://www.npmjs.com/package/sharp) - A package for image processing in node.js. Here it has been used to perform some operations on the image before storing it in the backend.

[validator](https://www.npmjs.com/package/validator) - An npm package that provides some common string validators and sanitizers. Here it has been used to check if the email is of valid syntax or not.

[mongodb](https://www.npmjs.com/package/mongodb) - MongoDB driver for node.js application to connect to mongoDB database.

[mongoose](https://www.npmjs.com/package/mongoose) - A mongoDb object modelling tool that provides an abstraction over the mongoDB driver thus making it easier to connect to mongoDB database.
Here it has been used to setup configuration for the schema and to connect to the running instance of mongoDB database.

[express.js](https://www.npmjs.com/package/express) - A very popular package to set up API routing and handling in node.js backend applications. Provides myriad functionalities including middleware 
to perform necesary operations on the received data. Here it has been used to setup API routes for the application.

[@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail) - A package to provide programmatic mail services to the application. Here it has been used to send personalized emails when a user 
signs up or deletes the account. It requires an account on [sendgrid](https://sendgrid.com/) to access the functionality.

[jest](https://www.npmjs.com/package/jest) - A powerful testing framewok that is used for testing the code being developed. Here it has beendone to write unit test cases and to test the different API routes 
to make sure they are working as expected. Also used for testing other functionalities of the project.

The project also uses middlewares to perform some operations before working on data like authenticating the identity of the user, resizing the image before saving in the DB, performing check 
for email validation among others.

### Running the code
1) Clone the repository
2) Navigate to the root folder and run **npm install** to install all the dependencies
3) Run **npm start** to run the server

Please feel free to drop any suggestions at hardikgaur@geu.ac.in.
