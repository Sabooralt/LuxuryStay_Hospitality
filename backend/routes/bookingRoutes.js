const {
  bookRoom,
  getAllBookings,
  deleteBooking,
  getGuestBooking,
} = require("../controllers/bookingController");
const express = require("express");

const router = express.Router();

router.post("/:userType/:userId", bookRoom);
router.get("/", getAllBookings);
router.get("/:guestId", getGuestBooking);
router.post("/:userType/:userId/deleteBooking", deleteBooking);

module.exports = router;
