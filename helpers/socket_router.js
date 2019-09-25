const redis = require("../models/redis_Db");
const io_emitter = require("./io_emmiter");

module.exports = function(io) {
  io.on("connection", function(socket) {
    if (!io_emitter.io) {
      io_emitter.io = io;
    }
    socket.on("userLoggedIn", data => {
      redis.setSocket(data, socket.id);
    });
    //AUCTION ROOMS
    socket.on("enterAuctionRoom", data => {
      socket.join(data);
    });
    socket.on("leaveAuctionRoom", data => {
      socket.leave(data);
    });
  });
};
