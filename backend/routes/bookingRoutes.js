const {
  bookRoom,
  getAllBookings,
  deleteBooking,
  getGuestBooking,
  calculateTotalRevenue,
} = require("../controllers/bookingController");
const express = require("express");

const router = express.Router();

router.post("/:userType/:userId", bookRoom);
router.get("/total-revenue", calculateTotalRevenue);
router.get("/", getAllBookings);
router.get("/:guestId", getGuestBooking);
router.post("/:userType/:userId/deleteBooking", deleteBooking);

module.exports = router;
