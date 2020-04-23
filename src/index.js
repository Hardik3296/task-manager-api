const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
//   res.status(503).send("Site is under maintenance. Please try back later.");
// });

//This function is to set express to parse the json data automatically
app.use(express.json());

//Registering routers to be used for the app
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is running on " + port);
});

// const jwt = require("jsonwebtoken");

// const myFunction = async () => {
//   const token = jwt.sign({ _id: "abc123" }, "thisismynewcourse", {
//     expiresIn: "7 days",
//   });
//   console.log(token);
//   const data = jwt.verify(token, "thisismynewcourse");
//   console.log(data);
// };

// myFunction();

//Learning about virtuals and references
// const Task = require("./models/task");
// const User = require("./models/user");

// const main = async () => {
//   // const task = await Task.findById("5e9efa51f447e31b689a8389");
//   //This code is used by mongoose to populate the owner object in the property using ref
//   //defined in the argument property to populate()
//   //Therefore owner property is replaced by the entire owner object who owns the task
//   // await task.populate("owner").execPopulate();
//   // console.log(task.owner);
//   const user = await User.findById("5e9ef9ed06e2053be80d93c6");
//   //Even though the tasks property does not exist we use virtuals to
//   //establish relation between the user and task collection for the owner
//   //Code for this is implemented in user model
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };
// main();

// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits: {
//     //This sets the max file size allowed to upload
//     fileSize: 1000000,
//   },
//   //This function is used to performa filtering opertaions when uploading a file
//   //arg1-req object; arg2-file object containing details of file; arg3-callback function
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/))
//       return cb(new Error("PLease upload a word file"));
//     //First argument is error and second is boolean value to allow upload or not
//     cb(undefined, true);
//   },
// });

// //The argument to upload.single() should be same as the key in query containing the file
// app.post("/upload", upload.single("upload"), (req, res) => {
//   res.send();
// });
