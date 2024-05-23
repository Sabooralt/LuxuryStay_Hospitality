const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
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
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    totalCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
