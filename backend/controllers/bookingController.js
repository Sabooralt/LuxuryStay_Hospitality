const generateUniqueKey = require("../utils/generateUniqueKey");
const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const RoomType = require("../models/roomTypeModel");
const {
  sendNotificationToAdmins,
  sendNotification,
} = require("./notificationController");
const generateBookingId = require("../utils/generateBookingId");
const { sendEmail } = require("./emailController");
const { htmlContent } = require("../utils/emailTemplate");

const bookRoomByGuest = async (req, res) => {
  try {
    const { roomTypeId, memberId, checkInDate, checkOutDate } = req.body;
    const { guestId, userType } = req.params;

    // Validate userType
    if (!["Staff", "User"].includes(userType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type" });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut < checkIn) {
      return res.status(400).json({
        success: false,
        message: "Checkout date cannot be before check-in date",
      });
    }

    const stringRoomTypeId = roomTypeId.toString();

    const rooms = await Room.find({
      type: stringRoomTypeId,
    });

    const roomType = await RoomType.findById(roomTypeId);
    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${roomType.type} rooms available currently.`,
      });
    }

    let assignedRoom = null;
    for (const room of rooms) {
      const conflictingBookings = await Booking.find({
        room: room._id,
        $or: [
          { checkInDate: { $lt: checkOutDate, $gte: checkInDate } },
          { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } },
        ],
      });

      if (conflictingBookings.length === 0) {
        assignedRoom = room;
        break;
      }
    }

    if (!assignedRoom) {
      return res.status(400).json({
        success: false,
        message: `No ${roomType.type} rooms available for the selected dates`,
      });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "No member found with the provided ID!",
      });
    }
    const memberName = member.fullName;

    // Calculate booking details
    const numberOfNights = Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );
    const totalBookingCost = numberOfNights * assignedRoom.pricePerNight;

    const uniqueKey = await generateUniqueKey();
    const bookingId = await generateBookingId();

    const description = `${memberName} booked room ${assignedRoom.roomNumber} for ${numberOfNights} night(s).`;

    // Create and save the booking
    const booking = new Booking({
      bookingId,
      room: assignedRoom._id,
      stay: numberOfNights,
      member: memberId,
      bookingCost: totalBookingCost,
      description,
      uniqueKey,
      checkInDate,
      checkOutDate,
      bookedBy: memberId,
      bookedByModel: userType,
      totalCost: totalBookingCost,
    });

    const newBooking = await booking.save();

    // Update room status
    assignedRoom.availibility = "not available";
    assignedRoom.bookings.push(newBooking._id);
    await assignedRoom.save();

    const fieldsToSelect =
      userType === "User"
        ? ["username", "role", "first_name"]
        : ["username", "role"];

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("room")
      .populate("member")
      .populate({
        path: "bookedBy",
        model: userType,
        select: fieldsToSelect,
      });

    // Send notifications
    if (userType === "Staff") {
      await sendNotificationToAdmins(
        req,
        `A staff member booked room ${assignedRoom.roomNumber} for ${memberName} for a duration of ${numberOfNights} night(s).`,
        description
      );
    } else {
      await sendNotificationToAdmins(req, "New Room Booking!", description);
    }

    await sendNotification(
      req,
      `Booking Confirmation!`,
      `Your booking has been successfully confirmed. We're thrilled to have you with us! Please keep an eye on your email for all the exciting details. Have a wonderful day!`,
      `/profile/booking/${populatedBooking._id}`,
      "member",
      memberId
    );

    // Notify users via socket
    const guestIdString = memberId.toString();
    const socketId = req.guestSockets[guestIdString];
    if (socketId) {
      req.io.to(socketId).emit("newBooking", populatedBooking);
    } else {
      console.log(`Socket ID not found for guest with ID: ${memberId}`);
    }
    Object.values(req.staffSockets).forEach((socketId) => {
      req.io.to(socketId).emit("newBooking", populatedBooking);
    });
    Object.values(req.userSockets).forEach((socketId) => {
      req.io.to(socketId).emit("newBooking", populatedBooking);
    });

    // Send email
    setImmediate(async () => {
      const htmlContent = `
        <h1>Booking Confirmation</h1>
        <p>Booking Details:</p>
        <ul>
          <li>BookingId: ${populatedBooking.bookingId}</li>
          <li>Room Number: ${assignedRoom.roomNumber}</li>
          <li>Check-In Date: ${checkInDate}</li>
          <li>Check-Out Date: ${checkOutDate}</li>
          <li>Total Cost: Rs.${totalBookingCost.toLocaleString()}</li>
        </ul>
        <p>Thank you for booking with us!</p>
      `;

      try {
        await sendEmail(
          member.email,
          "Booking Confirmation!",
          `Booking Details: \n BookingId: ${populatedBooking.bookingId} `,
          htmlContent
        );
      } catch (error) {
        console.error("Error sending booking confirmation email:", error);
      }
    });

    res.status(201).json({
      success: true,
      id: populatedBooking._id,
      message: `Booking created successfully, the key to access the room is ${populatedBooking.uniqueKey}`,
    });
  } catch (error) {
    console.error("Error booking room:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const bookRoom = async (req, res) => {
  try {
    const { roomId, memberId, checkInDate, checkOutDate } = req.body;
    const { userId, userType } = req.params;
    if (!["Staff", "User"].includes(userType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut < checkIn) {
      return res.status(400).json({
        success: false,
        message: "Checkout date cannot be before check-in date",
      });
    }

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
    const bookingId = await generateBookingId();

    const description = `${memberName} booked room ${room.roomNumber} for ${numberOfNights} night(s).`;

    const booking = new Booking({
      bookingId,
      room: roomId,
      stay: numberOfNights,
      member: memberId,
      bookingCost: totalBookingCost,
      description,
      uniqueKey,
      checkInDate,
      checkOutDate,
      bookedBy: userId,
      bookedByModel: userType,
      totalCost: totalBookingCost,
    });

    const newBooking = await booking.save();

    room.status = "occupied";
    room.availibility = "not available";
    room.bookings.push(newBooking._id);
    await room.save();

    const fieldsToSelect =
      userType === "User"
        ? ["username", "role", "first_name"]
        : ["username", "role"];

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("room")
      .populate("member")
      .populate({
        path: "bookedBy",
        model: userType,
        select: fieldsToSelect,
      });

    if (userType === "Staff") {
      await sendNotificationToAdmins(
        req,
        `A staff member booked room ${room.roomNumber} for ${memberName} for a duration of ${numberOfNights} night(s).`,
        description
      );
    } else {
      await sendNotificationToAdmins(req, "New Room Booking!", description);
    }

    await sendNotification(
      req,
      `Booking Confirmation!`,
      `Your booking has been successfully confirmed. We're thrilled to have you with us! Please keep an eye on your email for all the exciting details. Have a wonderful day!`,
      `/profile/booking/${populatedBooking._id}`,
      "member",
      memberId
    );

    const guestIdString = memberId.toString();
    const socketId = req.guestSockets[guestIdString];
    if (socketId) {
      req.io.to(socketId).emit("newBooking", populatedBooking);
    } else {
      console.log(`Socket ID not found for guest with ID: ${memberId}`);
    }
    Object.values(req.staffSockets).forEach((socketId) => {
      req.io.to(socketId).emit("newBooking", populatedBooking);
    });

    Object.values(req.userSockets).forEach((socketId) => {
      req.io.to(socketId).emit("newBooking", populatedBooking);
    });

    setImmediate(async () => {
      const htmlContent = `
        <h1>Booking Confirmation</h1>
        <p>Booking Details:</p>
        <ul>
          <li>BookingId: ${populatedBooking.bookingId}</li>
          <li>Room Number: ${room.roomNumber}</li>
          <li>Check-In Date: ${checkInDate}</li>
          <li>Check-Out Date: ${checkOutDate}</li>
          <li>Total Cost: Rs.${totalBookingCost.toLocaleString()}</li>
        </ul>
        <p>Thank you for booking with us!</p>
      `;

      try {
        await sendEmail(
          member.email,
          "Booking Confirmation!",
          `Booking Details: \n BookingId: ${populatedBooking.bookingId} `,
          htmlContent
        );
      } catch (error) {
        console.error("Error sending booking confirmation email:", error);
      }
    });
    res.status(201).json({
      success: true,
      message: `Booking created successfully, the key to access the room is ${populatedBooking.uniqueKey}`,
    });
  } catch (error) {
    console.error("Error booking room:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const getGuestBooking = async (req, res) => {
  try {
    const { guestId } = req.params;

    const guest = await User.findById(guestId);

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "No guest found with the id provied",
      });
    }

    const bookings = await Booking.find({ member: guestId })
      .populate("room")
      .populate("member")
      .populate("bookedBy");

    if (!bookings) {
      return res
        .status(404)
        .json({ success: false, message: "No bookings found for the user" });
    }

    return res.status(200).json({ success: true, bookings: bookings });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("room").populate("member");

    for (let booking of bookings) {
      const fieldsToSelect =
        booking.bookedByModel === "User"
          ? "username role first_name"
          : "username role";
      await booking.populate({
        path: "bookedBy",
        select: fieldsToSelect,
      });
    }

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
    let user;
    const { userId, userType } = req.params;
    const { bookingIds } = req.body;

    if (userType === "staff") {
      user = (await Staff.findById(userId)).username;
    }

    if (userType === "admin") {
      user = (await User.findById(userId)).first_name;
    }

    const bookings = await Booking.find({ _id: { $in: bookingIds } });

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No booking found with the id provided!",
      });
    }

    const roomIds = bookings.map((booking) => booking.roomId);

    const result = await Booking.deleteMany({ _id: { $in: bookingIds } });

    const updateRoomResult = await Room.updateMany(
      { _id: { $in: roomIds } },
      { $set: { availability: "available", status: "cleaning" } }
    );

    if (result.deletedCount === 1) {
      await sendNotificationToAdmins(
        req,
        "Booking deleted!",
        `${user} deleted a booking!`
      );
    } else if (result.deletedCount > 1) {
      await sendNotificationToAdmins(
        req,
        "Multiple bookings deleted!",
        `${user} deleted multiple bookings!`
      );
    }

    req.io.emit("bookingDelete", bookingIds);

    return res.status(200).json({
      success: true,
      message: `Selected booking(s) deleted: ${result.deletedCount}. Rooms updated: ${updateRoomResult.modifiedCount}.`,
      description: "Admins Notified!",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: err });
  }
};

const calculateTotalRevenue = async (req, res) => {
  try {
    const bookings = await Booking.find();
    let totalRevenue = 0;

    bookings.forEach((booking) => {
      totalRevenue += booking.totalCost;
    });

    res.status(200).json({ success: true, totalRevenue });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

module.exports = {
  bookRoom,
  getAllBookings,
  deleteBooking,
  getGuestBooking,
  bookRoomByGuest,
  calculateTotalRevenue,
};
