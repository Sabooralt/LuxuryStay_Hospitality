const Task = require("../models/taskModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A client connected to task socket");

    socket.on("createTask", (newTask) => {
      io.emit("taskCreated", newTask);
    });

    socket.on("markTaskAsSeen", ({ taskId, staffId }) => {
      socket.broadcast.emit("taskMarkedAsSeen", { taskId, staffId });
    });
    socket.on("disconnect", () => {
      console.log("A client disconnected from task socket");
    });
  });
};
