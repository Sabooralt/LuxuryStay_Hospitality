const express = require("express");

const {
  loginUser,
  signupUser,
  getUsers,
  getMembers,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);

router.get("/members", getMembers);

//Login
router.post("/login", loginUser);

//Signup
router.post("/signup", signupUser);

module.exports = router;
