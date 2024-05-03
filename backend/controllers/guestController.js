const Guest = require("../models/guestModel");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "15d" });
};

const getGuests = async (req, res) => {
  const guest = await Guest.find({}).sort({ createdAt: -1 });

  res.status(201).json(guest);
};
//login guest
const loginguest = async (req, res) => {
  const { email, password } = req.body;

  try {
    const guest = await Guest.login(email, password);

    const token = createToken(guest._id);

    res.status(200).json({
      _id: guest._id,
      email: guest.email,
      first_name: guest.first_name,
      last_name: guest.last_name,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signupguest = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const guest = await Guest.signup(first_name, last_name, email, password);

    const token = createToken(guest._id);

    res.status(200).json({ first_name, last_name, email, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { loginguest, signupguest, getGuests };
