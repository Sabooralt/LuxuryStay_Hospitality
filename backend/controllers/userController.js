const User = require("../models/userModel");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "15d" });
};

const getUsers = async (req, res) => {
  const user = await User.find({}).sort({ createdAt: -1 });

  res.status(201).json(user);
};
//login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(User._id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role : user.role,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signupUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const user = await User.signup(first_name, last_name, email, password);

    const token = createToken(User._id);

    res.status(200).json({ first_name, last_name, email, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { loginUser, signupUser, getUsers };
