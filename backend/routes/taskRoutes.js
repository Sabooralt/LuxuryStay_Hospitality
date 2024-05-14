const { createTask,getTask, deleteTask, viewBy } = require("../controllers/taskController");
const checkAdmin = require("../middlewares/checkAdmin");
const express = require("express");

const router = express.Router();

router.post("/create",createTask);
router.get("/get_staff_tasks/:id",getTask);
router.post("/:taskId/seenBy/:staffId",viewBy)

router.delete('/delete/:id',deleteTask)



module.exports = router;
