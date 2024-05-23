const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  uniqueKey: {
    type: Number,
    unique: true,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["booked", "checkedIn", "checkedOut"],
    default: "booked",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
