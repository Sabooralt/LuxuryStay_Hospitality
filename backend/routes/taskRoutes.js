const { createTask } = require("../controllers/taskController");
const checkAdmin = require("../middlewares/checkAdmin");
const express = require("express");

const router = express.Router();

router.post("/create", checkAdmin,createTask);



module.exports = router;
