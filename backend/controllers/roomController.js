const Room = require("../models/roomModel");

const createRoom = async (req, res) => {
  try {
    const images = req.files.map((file) => ({
      filepath: file.filename,
    }));

    if(!req.body){
      return res.json({message: "Req.body"})
    }
    const room = await Room.create({ ...req.body, images: images });

    res.status(201).json({ message: "Room created successfully", room: room });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: "Validation error", message: err.message });
    } else {
      res.status(500).json({ error: "Internal server error", message: err.message });
    }
  }
};


module.exports = {createRoom,}
