const {
  sendNotificationToAdmins,
  sendNotificationAllStaff,
  sendNotification,
} = require("../controllers/notificationController");
const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");

const checkInBookings = async (req) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingsToCheckIn = await Booking.find({
      checkInDate: { $eq: today },
      status: { $ne: "checkedIn" },
    });

    if (bookingsToCheckIn.length === 0) {
      return null;
    }

    for (const booking of bookingsToCheckIn) {
      booking.status = "checkedIn";
      await booking.save();

      const room = await Room.findById(booking.room);
      room.status = "occupied";
      await room.save();

      await sendNotificationToAdmins(
        req,
        `Guest checked in to room ${room.roomNumber}.`,
        `Booking status updated to checkedIn and room status updated to occupied.`,
        `/booking/${booking._id}`
      );

      await sendNotificationAllStaff(
        req,
        `Guest checked in to room ${room.roomNumber}.`,
        `Booking status updated to checkedIn and room status updated to occupied.`,
        ""
      );
      await sendNotification(
        req,
        "Booking Status Update: Check-In Successful",
        "Your check-in is complete. Welcome to your stay!",
        `/profile/bookings/${booking._id}`,
        "member",
        booking.member
      );

      const guestIdString = booking.member.toString();
      const socketId = req.guestSockets[guestIdString];
      if (socketId) {
        req.io.to(socketId).emit("bookingStatus", booking);
      } else {
        console.log(`Socket ID not found for guest with ID: ${guestIdString}`);
      }
      Object.values(req.staffSockets).forEach((socketId) => {
        req.io.to(socketId).emit("bookingStatus", booking);
      });

      Object.values(req.userSockets).forEach((socketId) => {
        req.io.to(socketId).emit("bookingStatus", booking);
      });

      console.log(
        `Booking status updated to checkedIn for booking ID: ${booking._id}`
      );
    }
  } catch (error) {
    console.error("Error updating bookings to checkedIn:", error);
  }
};
const checkOutBookings = async (req, res) => {
  try {
    const now = new Date();

    const pastBookings = await Booking.find({
      checkOutDate: { $lt: now },
      status: { $ne: "checkedOut" },
    });
    if (pastBookings.length === 0) {
      return null;
    }

    for (const booking of pastBookings) {
      booking.status = "checkedOut";
      await booking.save();

      const room = await Room.findById(booking.room);
      room.status = "cleaning";
      room.availibility = "available";
      const newRoom = await room.save();

      await sendNotificationToAdmins(
        req,
        `A Member checked out of ${room.roomNumber}.`,
        `Room status is updated to ${newRoom.status}!`
      );

      await sendNotificationAllStaff(
        req,
        `A Member checked out of ${room.roomNumber}.`,
        `Room ${newRoom.roomNumber} is ${newRoom.availibility} now and room status is updated to ${newRoom.status}!`
      );
      await sendNotification(
        req,
        "Booking Status Update: Check-Out Complete",
        "Your check-out is complete. We hope you enjoyed your stay!",
        `/profile/bookings/${booking._id}`,
        "member",
        booking.member
      );

      const guestIdString = booking.member.toString();
      const socketId = req.guestSockets[guestIdString];
      if (socketId) {
        req.io.to(socketId).emit("bookingStatus", booking);
      } else {
        console.log(`Socket ID not found for guest with ID: ${guestIdString}`);
      }
      Object.values(req.staffSockets).forEach((socketId) => {
        req.io.to(socketId).emit("bookingStatus", booking);
      });

      Object.values(req.userSockets).forEach((socketId) => {
        req.io.to(socketId).emit("bookingStatus", booking);
      });
    }

    console.log(`Checked and updated ${pastBookings.length} past bookings.`);
  } catch (error) {
    console.error("Error updating bookings after checkout:", error);
  }
};

module.exports = { checkOutBookings, checkInBookings };
