const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Staff = require("../models/staffModel");

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, createdBy } = req.body;

    const task = await Task.create({ ...req.body });
    const createdByUser = await User.findById(createdBy).select(
      "first_name last_name"
    );
    task.createdBy = createdByUser;

    req.io.emit("createTask", task);

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

      const seenByStaffIds = task.seenBy; // Assuming task.seenBy is an array of staff IDs
      const seenByStaff = await Staff.find({ _id: { $in: seenByStaffIds } });
      
      const seenBy = task.seenBy.map(id => {
          const staff = seenByStaff.find(staff => staff._id.equals(id)); // Find staff object by ID
          return { _id: id, username: staff ? staff.username : '' }; // If staff object found, return object with username, otherwise empty string
      });
      
      console.log(seenBy)
      req.io.emit("taskMarkedAsSeen", {
        taskId,
        staffId,
        seenBy: seenBy,
      });

      return res.status(200).json({ success: true, task,});
    } else {
      return res.status(409).json({ success: false, message: "Already seen" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
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

module.exports = { createTask, getTask, deleteTask, viewBy };
