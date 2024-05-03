require("dotenv").config();
const Staff = require("../models/staffModel");

const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "15d" });
};

const getStaff = async (req, res) => {
  const staff = await Staff.find({}).sort({ createdAt: -1 });

  res.status(201).json(staff);
};

const deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const staff = await Staff.findByIdAndDelete(id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res
      .status(200)
      .json({ message: `${staff.username} deleted successfully`, staff });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateStaffRole = async (req, res) => {
  const { id } = req.params;

  try {
    const staff = await Staff.findById(id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.role = req.body.role;
    await staff.save();

    res
      .status(200)
      .json({
        message: "Staff role updated successfully",
        _id: staff._id,
        role: staff.role,
      });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginStaff = async (req, res) => {
  const { username, password } = req.body;

  try {
    const staff = await Staff.login(username, password);

    const token = createToken(staff._id);

    res.status(200).json({
      _id: staff._id,
      username: staff.username,
      role: staff.role,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signupStaff = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const staff = await Staff.signup(username, password, role);

    const token = createToken(staff._id);
  const fullStaff = await Staff.findById(staff._id)


    res.status(200).json({ fullStaff, password, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  loginStaff,
  signupStaff,
  getStaff,
  updateStaffRole,
  deleteStaff,
};
