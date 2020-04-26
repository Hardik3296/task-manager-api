const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
// app.use((req, res, next) => {
//   res.status(503).send("Site is under maintenance. Please try back later.");
// });

//This function is to set express to parse the json data automatically
app.use(express.json());

//Registering routers to be used for the app
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
