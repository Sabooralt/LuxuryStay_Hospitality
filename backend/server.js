require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Routes initialization
const userRoutes = require('./routes/userRoutes')
const staffRoutes = require('./routes/staffRoutes');
const roomRoutes = require('./routes/roomRoutes');
const roomTypeRoutes = require('./routes/roomTypeRoutes');
const taskRoutes = require('./routes/taskRoutes')

// Sockets initialization
const taskSocket = require("./sockets/taskSocket");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Define routes
app.use("/api/user",userRoutes);
app.use("/api/staff",staffRoutes);
app.use("/api/roomType",roomTypeRoutes)
app.use("/api/room",roomRoutes);
app.use("/api/task",taskRoutes);

//Sockets


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    server.listen(process.env.PORT, () => {
      console.log("Listening to", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
  io.on("connection", (socket) => {
    console.log("A client connected");
  
    // Example: Broadcasting a message to all connected clients
    socket.on("sendMessage", (message) => {
      io.emit("newMessage", message);
    });
  
    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });
