const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Function to generate authentication token
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error();
    //Setting up user and token in req object
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Authentication Failed" });
  }
};

module.exports = auth;
