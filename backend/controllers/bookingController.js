const generateUniqueKey = require("../utils/generateUniqueKey");
const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const { sendNotificationToAdmins } = require("./notificationController");

const bookRoom = async (req, res) => {
  try {
    const { roomId, memberId, checkInDate, checkOutDate, bookedBy } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const room = await Room.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const member = await User.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "No member found with the id provided!",
      });
    }
    const memberName = member.fullName;

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

    const numberOfNights = Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );

    const totalBookingCost = numberOfNights * room.pricePerNight;

    const uniqueKey = await generateUniqueKey();

    const description = `${memberName} booked room ${room.roomNumber} for ${numberOfNights} night(s).`;

    const booking = new Booking({
      room: roomId,
      member: memberId,
      description: description,
      uniqueKey: uniqueKey,
      checkInDate,
      checkOutDate,
      bookedBy,
      totalCost: totalBookingCost,
    });

    const newBooking = await booking.save();

    room.status = "occupied";
    room.availibility = "not available";
    room.bookings.push(newBooking._id);
    await room.save();

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("room")
      .populate("member")
      .populate("bookedBy", ["username", "role"]);

    if (newBooking.bookedBy) {
      await sendNotificationToAdmins(
        req,
        `A staff member booked room ${room.roomNumber} for ${memberName} for a duration of ${numberOfNights} night(s).`,
        description
      );
    } else {
      await sendNotificationToAdmins(req, "New Room Booking!", description);
    }

    Object.values(req.staffSockets).forEach((socketId) => {
      req.io.to(socketId).emit("newBooking", populatedBooking);
    });

    Object.values(req.userSockets).forEach((socketId) => {
      req.io.to(socketId).emit("newBooking", populatedBooking);
    });

    return res.status(201).json({
      success: true,
      message: `Booking created successfully, the key to access the room is ${populatedBooking.uniqueKey}`,
    });
  } catch (error) {
    console.error("ror booking room:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room")
      .populate("member")
      .populate("bookedBy", ["username", "role"]);

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

const deleteBooking = async (req, res) => {
  try {
    const { staffId } = req.params;

    const { bookingIds } = req.body;

    const staff = (await Staff.findById(staffId)).username;

    const result = await Booking.deleteMany({ _id: { $in: bookingIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No booking found with the id provided!",
      });
    }

    if (result.deletedCount === 1) {
      await sendNotificationToAdmins(
        req,
        "Booking deleted!",
        `${staff} deleted a booking!`
      );
    }

    await sendNotificationToAdmins(
      req,
      "Multiple bookings deleted!",
      `${staff} deleted multiple bookings!`
    );

    req.io.emit("bookingDelete", bookingIds);

    return res.status(200).json({
      success: true,
      message: `Selected booking(s) deleted: ${result.deletedCount}.`,
      description: "Admins Notified!"
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: err });
  }
};

module.exports = { bookRoom, getAllBookings, deleteBooking };
