const Task = require('../models/taskModel');

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, createdBy } = req.body;
    const task = await Task.create({ ...req.body });

    return res.status(201).json({ success: true, message: "Task created!", task });
  } catch (err) {
    console.error('Error creating task:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { createTask };
