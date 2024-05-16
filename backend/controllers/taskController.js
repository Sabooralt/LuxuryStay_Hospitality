const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const {
  sendNotificationToAdmins,
  sendNotificationAllStaff,
  sendNotificationToStaff,
} = require("./notificationController");

const createTask = async (req, res) => {
  try {
    const { createdBy } = req.body;

    const task = await Task.create({ ...req.body });
    await task.populate("assignedTo", "username");

    const createdByUser = await User.findById(createdBy).select(
      "first_name last_name"
    );
    task.createdBy = createdByUser;

    req.io.emit("createTask", task);

    if (task.assignedAll) {
      await sendNotificationAllStaff(
        req,
        "A new task has been assigned to you.",
        task.description,
        `/staff/tasks/${task._id}`
      );

      await sendNotificationToAdmins(
        req,
        "A Task has been assigned to All the staff",
        task.description
      );
    }

    if (task.assignedTo && task.assignedTo.length > 0) {
      const assignedToUsernames = task.assignedTo.map(staff => staff.username).join(', ');
    
      await sendNotificationToAdmins(
        req,
        `A Task has been assigned to ${assignedToUsernames}`,
        task.description,
       
      );
      await sendNotificationToStaff(
        req,
        `A Task has been assigned to you from ${createdByUser.first_name}`,
        task.description,
        task._id,
        task._id
      )
    }

    return res
      .status(201)
      .json({ success: true, message: "Task created!", task });
  } catch (err) {
    console.error("Error creating task:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.body;

    const tasks = await Task.find({
      assignedTo: id,
      assignedAll: true,
    }).populate([
      { path: "createdBy", select: ["first_name", "last_name"] },
      { path: "seenBy", select: "username" },
      { path: "completedBy", select: "username" },
    ]);

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks found for the staff" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Tasks fetched successfully!", tasks });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const viewBy = async (req, res) => {
  try {
    const { staffId, taskId } = req.params;
    const task = await Task.findOne({ _id: taskId });

    if (!task.seenBy.includes(staffId)) {
      task.seenBy.push(staffId);

      await task.save();

      const seenByStaffIds = task.seenBy;
      const seenByStaff = await Staff.find({ _id: { $in: seenByStaffIds } });

      const seenBy = task.seenBy.map((id) => {
        const staff = seenByStaff.find((staff) => staff._id.equals(id));
        return { _id: id, username: staff ? staff.username : "" };
      });

      console.log(seenBy);
      req.io.emit("taskMarkedAsSeen", {
        taskId,
        staffId,
        seenBy: seenBy,
      });

      return res.status(200).json({ success: true, task });
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const markAsCompleted = async (req, res) => {
  try {
    const { taskId, staffId } = req.params;

    const task = await Task.findById(taskId);

    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.status === "Completed") {
      return res
        .status(400)
        .json({ success: false, message: "Task is already completed" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { $set: { status: "Completed", completedBy: staffId } },
      { new: true }
    ).populate("completedBy", "username");

    req.io.emit("taskCompleted", {
      status: updatedTask.status,
      completedBy: updatedTask.completedBy,
      taskId,
      staffId,
    });

    return res.status(200).json({
      success: true,
      message: "Task marked as completed",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Error marking task as completed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete({ _id: id });

    return res.status(200).json(task);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createTask, getTask, deleteTask, viewBy, markAsCompleted };
