const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/account");

//Creating a router
const router = new express.Router();

//Router and function for user creation
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Router and function for user login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

//Router and function for getting user profile
router.get("/users/me", auth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

//Creating a multer object
const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/))
      cb(new Error("Please upload an image"));
    cb(undefined, true);
  },
});

//Router and function to upload profile pic
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = sharp(req.file.buffer)
      .png()
      .resize({ width: 250, height: 250 })
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//Router and function to delete the profile pic
router.delete(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(500).send({ error: error.message });
  }
);

//Router and function to send the profile pic of a given user
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();
    res.set("Content-Type", "image/png").send();
  } catch (e) {
    res.status(404).send();
  }
});

//Router and function to logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Router and function to logout user from all places
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Router and function to update a user
router.patch("/users/me", auth, async (req, res) => {
  try {
    //Checking for allowed updates
    const allowedUpdates = ["name", "age", "password", "email"];
    const updatesToDo = Object.keys(req.body);
    const isValidOperation = updatesToDo.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation)
      return res.status(400).send({ error: "Invalid Updates" });

    //Restructuring for the middleware to run
    //findByIdAndUpdate() bypasses the middleware which we need to stop
    //there fore this way to update
    const updatedUser = req.user;
    updatesToDo.forEach((update) => (updatedUser[update] = req.body[update]));
    await updatedUser.save();
    res.send(updatedUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Router and function to delete a given user
router.delete("/users/me", auth, async (req, res) => {
  try {
    //Removing user from collection
    req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
