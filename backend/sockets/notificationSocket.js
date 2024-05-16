module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A client connected to task socket");
    socket.on("createNoti", (newNoti) => {
      io.to(newNoti.staff).emit("notiCreated", newNoti);
    });

    socket.on("seenNoti", (newNoti) => {
      socket.broadcast.emit("notiSeen", newNoti);
    });
  });
};
