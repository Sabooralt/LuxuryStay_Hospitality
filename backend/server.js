require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Routes initialization
const userRoutes = require("./routes/userRoutes");
const staffRoutes = require("./routes/staffRoutes");
const roomRoutes = require("./routes/roomRoutes");
const roomTypeRoutes = require("./routes/roomTypeRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notiRoutes = require("./routes/notiRoutes");

// Sockets initialization

const staffSockets = {};
const userSockets = {};

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  req.staffSockets = staffSockets;
  req.userSockets = userSockets;
  console.log(req.path, req.method);
  next();
});

// Define routes
app.use("/api/user", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/roomType", roomTypeRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/notis", notiRoutes);

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
  console.log("A user connected:", socket.id);

  socket.on("register", ({ role, userId }) => {
    if (role === "staff") {
      staffSockets[userId] = socket.id;
      console.log("a user connected to staff",staffSockets)
    } else if (role === "user") {
      console.log("a user connected to user",userSockets)

      userSockets[userId] = socket.id;
    }
  });

  socket.on("disconnect", () => {
    for (const userId in staffSockets) {
      if (staffSockets[userId] === socket.id) {
        delete staffSockets[userId];
        break;
      }
    }
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});
