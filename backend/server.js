require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const {Server} = require("socket.io");

const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin : "http://localhost:5173",
    methods: ["GET","POST"]
  }
});

// Routes initialization
const userRoutes = require("./routes/userRoutes");
const staffRoutes = require("./routes/staffRoutes");
const roomRoutes = require("./routes/roomRoutes");
const roomTypeRoutes = require("./routes/roomTypeRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notiRoutes = require("./routes/notiRoutes")

// Sockets initialization
const taskSocket = require("./sockets/taskSocket");
const notiSocket = require("./sockets/notificationSocket")

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  console.log(req.path, req.method);
  next();
});

// Define routes
app.use("/api/user", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/roomType", roomTypeRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/notis",notiRoutes)

//Sockets
taskSocket(io);
notiSocket(io)


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

  const socketUserMap = {};

  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("login", ({ userId, staffId }) => {
         const id = userId || staffId;
         socketUserMap[socket.id] = { id };
         console.log(`User/Staff ${id} logged in with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      delete socketUserMap[socket.id];
      console.log("A client disconnected:", socket.id);
    });
});


