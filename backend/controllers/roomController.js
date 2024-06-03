const Room = require("../models/roomModel");
const Staff = require("../models/staffModel");
const RoomType = require("../models/roomTypeModel");
const User = require("../models/userModel");
const { sendNotificationToAdmins } = require("./notificationController");

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("type");

    if (!rooms) {
      return res.status(404).json({ message: "No Rooms available" });
    }

    return res.status(200).json(rooms);
  } catch (err) {
    return res.status(500).json({ messsage: err });
  }
};
const createRoom = async (req, res) => {
  try {
    const { type, roomNumber, multipleRooms } = req.body; // Corrected variable name
    const images = req.files.map((file) => ({
      filepath: file.filename,
    }));

    const typeOfRoom = await RoomType.findById(type);

    if (!typeOfRoom) {
      return res
        .status(404)
        .json({ success: false, message: "Room type not found!" });
    }

    let rooms = [];
    let currentRoomNumber = roomNumber;

    const roomsToCreate = multipleRooms ? parseInt(multipleRooms, 10) : 1;

    for (let i = 0; i < roomsToCreate; i++) {
      const checkRoom = await Room.findOne({ roomNumber: currentRoomNumber });

      if (checkRoom) {
        // Changed to findOne and variable name checkRoom
        return res.status(409).json({
          success: false,
          message: `Room Number ${currentRoomNumber} not available!`,
        });
      }

      const room = await Room.create({
        ...req.body,
        roomNumber: currentRoomNumber,
        name: `${typeOfRoom.type} Room`,
        images: images,
      });

      rooms.push(room);
      currentRoomNumber++;
    }

    res
      .status(201)
      .json({ message: "Room(s) created successfully", rooms: rooms });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Validation error", message: err.message });
    } else {
      res
        .status(500)
        .json({ error: "Internal server error", message: err.message });
    }
  }
};

const checkRoomNumber = async (req, res) => {
  try {
    const { roomNumber } = req.body;

    console.log("Checking room number:", roomNumber);

    const avail = await Room.find({ roomNumber: roomNumber });

    console.log("Found rooms:", avail);

    if (avail.length === 0) {
      console.log("Room number available");
      return res
        .status(200)
        .json({ success: true, message: "Room number available" });
    }

    console.log("Room number not available");
    return res
      .status(409)
      .json({ success: false, message: "Room number not available" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id, staffId } = req.params;

    const room = await Room.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    );

    if (!room) {
      return res
        .status(404)
        .json({ success: true, message: "No such room with the id provided" });
    }
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "No such staff member with the id provided",
      });
    }

    const staffUsername = staff.username;

    await sendNotificationToAdmins(
      req,
      "Room Status Update by Staff Member",
      `Staff member ${staffUsername} has updated the status of room ${room.roomNumber} to ${room.status}.`
    );

    res.status(200).json({
      message: "Room status updated successfully",
      _id: room._id,
      status: room.status,
      staffUsername: staffUsername,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { userId } = req.params;

    const { roomIds } = req.body;

    const user = await User.findById(userId);

    if (user.role !== "admin") {
      console.log("Unauthorized!");
      return res.status(409).json({ success: false, message: "Unauthorized!" });
    }

    const result = await Room.deleteMany({ _id: { $in: roomIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No Rooms found with the id provided!",
      });
    }

    if (result.deletedCount === 1) {
      await sendNotificationToAdmins(
        req,
        "Room deleted!",
        `${user.fullName} deleted a service!`
      );
    } else if (result.deletedCount > 1) {
      await sendNotificationToAdmins(
        req,
        "Multiple Rooms deleted!",
        `${user.fullName} deleted multiple rooms!`
      );
    }

    req.io.emit("deleteRoom", roomIds);

    return res.status(200).json({
      success: true,
      message: `Selected room(s) deleted: ${result.deletedCount}.`,
      description: "Admins Notified!",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

module.exports = {
  createRoom,
  deleteRoom,
  getRooms,
  checkRoomNumber,
  updateStatus,
};
