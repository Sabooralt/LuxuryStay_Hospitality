const Task = require("../models/taskModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A client connected to task socket");

    socket.on("createTask", (newTask) => {
      Task.create(newTask).then((task) => {
        io.emit("taskCreated", task); // Broadcast the new task to all connected clients
      }).catch((error) => {
        console.error("Error creating task:", error);
      });
    });

    socket.on("disconnect", () => {
      console.log("A client disconnected from task socket");
    });
  });
};