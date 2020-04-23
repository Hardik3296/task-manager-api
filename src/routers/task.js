const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

//Router and function to create a new task
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Router and function to read all the tasks depending upon the options
//Updating the function to support some custom results like completed or not
//and also to support no of tasks displayed at a time and paginataion
//adding support for sorting as sortBy=parameter:desc/asc
router.get("/tasks", auth, async (req, res) => {
  try {
    //Way 1
    //const tasks = await Task.find({ owner: req.user._id });

    //Way 2
    const match = {};
    const sort = {};

    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          //Puts the value if it is integer, otherwise the option is ignored and there is no limit
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    const tasks = req.user.tasks;
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

//Router and function to read a particular task
router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    //If task is not found
    if (!task) res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

//Router and function to update a given task
router.patch("/tasks/:id", auth, async (req, res) => {
  try {
    //Checking for only allowed updates
    const allowedUpdates = ["description", "completed"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) res.status(400).send({ error: "Invalid Updates" });

    //Update is done in this way so that the middleware is run on update and it is not bypassed
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    //If particular task is not found
    if (!task) res.status(404).send();
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Router and function to delete a given task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    //If task is not found
    if (!task) res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
