const Room = require("../models/roomModel");


const getRooms = async (req,res)=>{
  try{
    const rooms = await Room.find()

    if(!rooms){
      return res.status(404).json({message: "No Rooms available"})
    }

    return res.status(200).json(rooms)
  }catch(err){
    return res.status(500).json({messsage: err})
  }
}
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


module.exports = {createRoom,getRooms}
