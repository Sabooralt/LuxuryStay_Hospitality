const {
  bookRoom,
  getAllBookings,
} = require("../controllers/bookingController");
const express = require("express");

const router = express.Router();

router.post("/", bookRoom);
router.get("/", getAllBookings);

module.exports = router;
