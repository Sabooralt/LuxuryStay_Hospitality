const {
  bookRoom,
  getAllBookings,
  deleteBooking
} = require("../controllers/bookingController");
const express = require("express");

const router = express.Router();

router.post("/", bookRoom);
router.get("/", getAllBookings);
router.post("/:staffId/deleteBooking",deleteBooking)

module.exports = router;
