require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const { sendEmail } = require("./controllers/emailController");

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
const {
  sendNotificationToAdmins,
  sendNotificationToAllStaff,
} = require("./controllers/notificationController");
const serviceRoutes = require("./routes/serviceRoutes");
const serviceCategoryRoutes = require("./routes/serviceCategoryRoutes");
const orderServiceRoutes = require("./routes/serviceOrderRoutes");
// Sockets initialization

const staffSockets = {};
const userSockets = {};
const guestSockets = {};

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  req.staffSockets = staffSockets;
  req.userSockets = userSockets;
  req.guestSockets = guestSockets;
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
app.use("/api/service", serviceRoutes);
app.use("/api/serviceCategory", serviceCategoryRoutes);
app.use("/api/orderService", orderServiceRoutes);

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
      userSockets[userId] = socket.id;
      console.log("a user connected to user", userSockets);
    } else if (role === "guest") {
      guestSockets[userId] = socket.id;
      console.log("a user connected to guest", guestSockets);
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
    for (const userId in guestSockets) {
      if (guestSockets[userId] === socket.id) {
        delete guestSockets[userId];
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
    });

    for (const booking of pastBookings) {
      booking.status = "checkedOut";
      await booking.save();

      const room = await Room.findById(booking.room);
      room.status = "maintenance";
      room.availibility = "available";
      const newRoom = await room.save();

      await sendNotificationToAdmins(
        req,
        `A Member checked out of ${room.roomNumber}.`,
        `room status is updated to ${newRoom.status}!`,
        ""
      );
      req, title, message, link, recipient, id;
      await sendNotificationToAllStaff(
        req,
        `A Member checked out of ${room.roomNumber}.`,
        `Room ${newRoom.roomNumber} is ${newRoom.availibility} now and room status is updated to ${newRoom.status}!`,
        " "
      );
    }

    console.log(`Checked and updated ${pastBookings.length} past bookings.`);
  } catch (error) {
    console.error("Error updating bookings after checkout:", error);
  }
});

cron.schedule("0 * * * *", async () => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const expiredTasks = await Task.find({
      deadlineDate: { $lte: twoDaysAgo },
    });

    for (const task of expiredTasks) {
      await task.remove();
      console.log(`Task deleted: ${task._id}`);
    }
  } catch (error) {
    console.error("Error deleting expired tasks:", error);
  }
});
