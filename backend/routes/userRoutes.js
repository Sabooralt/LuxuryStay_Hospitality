const express = require("express");

const {
  loginUser,
  signupUser,
  getUsers
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);

//Login
router.post("/login", loginUser);

//Signup
router.post("/signup", signupUser);

module.exports = router;
