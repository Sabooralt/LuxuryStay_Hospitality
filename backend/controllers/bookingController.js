const generateUniqueKey = require("../utils/generateUniqueKey");
const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");

const bookRoom = async (req, res) => {
  try {
    const { roomId, memberId, checkInDate, checkOutDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    if (room.availability !== "available") {
      return res
        .status(400)
        .json({ success: false, message: "Room is not available" });
    }

    const conflictingBookings = await Booking.find({
      room: roomId,
      $or: [
        { checkInDate: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } },
      ],
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Room is already booked for the selected dates",
      });
    }

    const uniqueKey = await generateUniqueKey();
    const booking = new Booking({
      room: roomId,
      member: memberId,
      uniqueKey: uniqueKey,
      checkInDate,
      checkOutDate,
    });

    const newBooking = await booking.save();

    room.status = "occupied";
    room.availibility = "not available";
    room.bookings.push(newBooking._id);
    await room.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error booking room:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("room").populate("member");

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Bookings Found!" });
    }

    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

module.exports = { bookRoom, getAllBookings };
