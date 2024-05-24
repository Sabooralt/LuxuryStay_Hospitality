require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");

// Models
const Task = require("./models/taskModel");
const Booking = require("./models/bookingModel");
const Room = require("./models/roomModel");

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
const bookingRoutes = require("./routes/bookingRoutes");

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
app.use("/api/booking", bookingRoutes);

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

  io.emit("clientCount", io.engine.clientsCount);

  socket.on("register", ({ role, userId }) => {
    if (role === "staff") {
      staffSockets[userId] = socket.id;
      console.log("a user connected to staff", staffSockets);
    } else if (role === "user") {
      console.log("a user connected to user", userSockets);

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
    io.emit("clientCount", io.engine.clientsCount);
  });
});

//Schedule Tasks

cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    const pastBookings = await Booking.find({
      checkOutDate: { $lt: now },
      status: "active",
    });

    for (const booking of pastBookings) {
      booking.status = "checkedOut";
      await booking.save();

      const room = await Room.findById(booking.room);
      room.status = "maintenance";
      room.availibility = "available";
      await room.save();
    }

    console.log(`Checked and updated ${pastBookings.length} past bookings.`);
  } catch (error) {
    console.error("Error updating bookings after checkout:", error);
  }
});

cron.schedule("0 * * * *", async () => {
  try {
    const tenHoursAgo = new Date();
    tenHoursAgo.setHours(tenHoursAgo.getHours() - 10);

    const expiredTasks = await Task.find({
      $expr: {
        $lt: [
          { $concat: ["$deadlineDate", "T", "$deadlineTime"] },
          tenHoursAgo.toISOString(),
        ],
      },
    });

    for (const task of expiredTasks) {
      await task.remove();
      console.log(`Task deleted: ${task._id}`);
    }
  } catch (error) {
    console.error("Error deleting expired tasks:", error);
  }
});
