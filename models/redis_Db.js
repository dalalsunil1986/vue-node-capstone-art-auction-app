const redis = require("redis").createClient();
const io = require("../helpers/io_emmiter");
exports.redis = redis;
exports.setUser = user => {
  //DO NOT USE REDIS WITH MONGODB
  //     redis.SETEX(user.userId.toString(), 60, user.toString(), (err, obj) => {
  //         console.log(obj)
  //     })
  //
  // }
  //
  // exports.getUser = (userId) => {
  //     redis.GET(userId, (err, user) => {
  //         return user
  //     })
};
///REDIS SOCKETS NOTIFICATIONS
exports.setSocket = (userId, socketId) => {
  redis.HSET("SOCKET", userId.toString(), socketId.toString(), (err, obj) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.bidOnAuctionEmit = (room, bid) => {
  return io.io.sockets.in(room).emit("auctionRoomGetBid", bid);
};

exports.notification = (userId, noti) => {
  redis.HGET("SOCKET", userId.toString(), (err, socket) => {
    if (socket) {
      if (io.io.sockets.connected[socket]) {
        return io.io.sockets.connected[socket].emit("notification", noti);
      }
    }
  });
};

exports.message = (from, to, message) => {
  redis.HGET("SOCKET", to.toString(), (err, socket) => {
    if (socket) {
      if (io.io.sockets.connected[socket]) {
        return io.io.sockets.connected[socket].emit("message", {
          from: from,
          message: message
        });
      }
    }
  });
};
