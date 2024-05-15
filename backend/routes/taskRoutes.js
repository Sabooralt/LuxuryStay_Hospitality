const { createTask,getTask, deleteTask, viewBy, markAsCompleted } = require("../controllers/taskController");
const checkAdmin = require("../middlewares/checkAdmin");
const express = require("express");

const router = express.Router();

router.post("/create",createTask);
router.get("/get_staff_tasks/:id",getTask);
router.post("/:taskId/seenBy/:staffId",viewBy);
router.patch("/:taskId/mark_as_completed/:staffId",markAsCompleted)

router.delete('/delete/:id',deleteTask)



module.exports = router;
