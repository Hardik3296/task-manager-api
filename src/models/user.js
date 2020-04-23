const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

//Defining schem a for user document
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      unique: true,
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      //Custom validation
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Email is invalid");
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Password cannot contain 'password'");
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) throw new Error("Age must be a positive number");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

//Funciton to create relation between user and task schema for a given user
//name to be used is same as one used as property name eg user.tasks
//This does not create a new property, it is simply a virtual property with
//no real existence
userSchema.virtual("tasks", {
  //the schema it should refer to
  ref: "Task",
  //the field in this object that is related to some field inn above mentioned schema
  localField: "_id",
  //the field in other schema which is related to som field in this schema
  foreignField: "owner",
});

//Creating a function for every instance of User schema
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//res.semd() calls JSON.tostringify() which internally calls object.toJSON() therefore no need for explicit call
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

//Creating a function for user schema in general
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid Credentials");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid Credentials");
  return user;
};

//Function to hash the plaintext password using middleware
userSchema.pre("save", async function (next) {
  //Here this refers to the user object that is defined above
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//Function to delete all the tasks when a user is deleted using middleware
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
