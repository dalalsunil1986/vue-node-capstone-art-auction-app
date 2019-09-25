const userDb = require("../models/userDb");
const productDb = require("../models/productDb");
const io = require("../helpers/io_emmiter");
const conversationDb = require("../models/conversationsDb");
const messagesDb = require("../models/messagesDb");
const verifyUser = require("../middleware/verifyUserByToken");
const xss = require("../helpers/xssFilters");
const filterAuctions = require("../helpers/auctions_filter");
const reviewsDb = require("../models/reviewsDb");
const soldDb = require("../models/soldDb");

// const multer = require('../middleware/cloudinaryStorage')
// const timeoutDb = require('../models/timeoutDb')
// const SHA2 = require('sha2')
// const verifyUser = require('../middleware/verifyUserByToken')

module.exports = {
  getOwnAuctions(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        productDb.find({ userId: user._id, active: true }).then(data => {
          return res.send({ success: data });
        });
      })
      .catch(() => {
        // io.socket.emit('serverError', "Ups, įvyko serverio klaida")
      });
  },
  getSingleAuction(req, res) {
    productDb.findOne({ _id: xss(req.headers.id) }).then(auction => {
      userDb
        .findOne({ _id: auction.userId })
        .then(user => {
          if (user) {
            return res.send({
              success: {
                auction: auction,
                user: {
                  username: user.username,
                  picture: user.picture,
                  rating: user.rating
                }
              }
            });
          }

          io.socket.emit("serverError", "Oops, a server error has occured.");
        })
        .catch(e => {
          console.log(e);
        });
    });
  },
  getAllAuctions(req, res) {
    productDb.countDocuments({ active: true }).then(count => {
      productDb
        .find({ active: true })
        .skip(Number(xss(req.headers.page)))
        .limit(10)
        .then(data => {
          res.send({
            success: {
              count: count,
              data: data
            }
          });
        });
    });
  },

  filter(req, res) {
    filterAuctions(
      req.body.city,
      req.body.category,
      req.body.sort,
      req.body.time,
      req.headers.page,
      res
    );
  },

  getUser(req, res) {
    userDb.findOne({ _id: xss(req.headers.id) }).then(user => {
      productDb.find({ userId: user._id, active: true }).then(product => {
        let rw;
        let sl;

        reviewsDb
          .aggregate([
            {
              $match: { userId: String(user._id) }
            },
            {
              $project: {
                size: { $size: "$reviews" }
              }
            }
          ])
          .then(reviewsSize => {
            if (reviewsSize.length < 1) {
              rw = 0;
            } else {
              rw = reviewsSize[0].size;
            }
            soldDb
              .aggregate([
                {
                  $match: { userId: String(user._id) }
                },
                {
                  $project: {
                    size: { $size: "$soldAuctions" }
                  }
                }
              ])
              .then(soldSize => {
                if (soldSize.length < 1) {
                  sl = 0;
                } else {
                  sl = soldSize[0].size;
                }
                return res.send({
                  success: {
                    user: {
                      userId: user._id,
                      username: user.username,
                      email: user.email,
                      rating: user.rating,
                      sales: sl,
                      reviews: rw,
                      description: user.description,
                      picture: user.picture
                    },
                    activeAuctions: product
                  }
                });
              });
          });
      });
    });
  },

  getWatching(req, res) {
    userDb.findOne({ _id: xss(req.headers.userid) }).then(user => {
      productDb.find({ _id: user.watching, active: true }).then(product => {
        res.send({ success: product });
      });
    });
  },
  async getConversations(req, res) {
    let user;
    let conversations;
    let aggregateUsers;
    let messages;
    let convos;

    try {
      user = await verifyUser(req.session.token);
    } catch (e) {
      return io.socket.emit("serverError", "Oops, a server error has occured.");
    }

    if (user) {
      try {
        conversations = await conversationDb.find({
          participants: String(user._id)
        });
      } catch (e) {
        return io.socket.emit(
          "serverError",
          "Oops, a server error has occured."
        );
      }

      if (conversations.length > 0) {
        let aggregateUserIds = conversations.map(x =>
          x.participants.filter(e => e !== String(user._id))
        );

        try {
          aggregateUsers = await userDb.find(
            { _id: aggregateUserIds },
            { picture: 1, username: 1 }
          );
        } catch (e) {
          return io.socket.emit(
            "serverError",
            "Oops, a server error has occured."
          );
        }

        convos = await aggregateUsers.map(async x => {
          let conv;

          let prcpn = [String(x._id), String(user._id)];

          try {
            conv = await conversationDb.find({ participants: { $all: prcpn } });
          } catch (e) {
            return io.socket.emit(
              "serverError",
              "Oops, a server error has occured."
            );
          }

          return {
            user: x,
            conversation: conv[0]._id
          };
        });

        let convosVal;

        Promise.all(convos).then(val => {
          convosVal = val;
          return getMessages(val);
        });

        async function getMessages(val) {
          messages = await val.map(async x => {
            let msg;

            try {
              msg = await messagesDb
                .find(
                  { conversationId: String(x.conversation) },
                  { content: 1 }
                )
                .sort({ timestamp: -1 })
                .limit(1);
            } catch (e) {
              return io.socket.emit(
                "serverError",
                "Oops, a server error has occured."
              );
            }

            let arr = msg[0].content;
            arr.reverse();

            return {
              conversation: x.conversation,
              user: x.user,
              message: arr[0]
            };
          });

          Promise.all(messages).then(msgVal => {
            return res.send({ success: msgVal });
          });
        }
      } else {
        return res.send({ success: null });
      }
    }
  },

  getChat(req, res) {
    verifyUser(req.session.token)
      .then(() => {
        if (req.headers.all !== "false") {
          messagesDb
            .findOne({ conversationId: xss(req.headers.convo) }, { content: 1 })
            .then(convo => {
              if (!convo) {
                return res.send({ success: false });
              }

              return res.send({ success: convo.content });
            });
        } else {
          messagesDb
            .findOne(
              { conversationId: xss(req.headers.convo) },
              { content: { $slice: -10 } }
            )
            .then(convo => {
              if (!convo) {
                return res.send({ success: false });
              }

              return res.send({ success: convo.content });
            });
        }
      })
      .catch(() => {
        // io.socket.emit('serverError', "Ups, įvyko serverio klaida")
      });
  },

  getOwnReviews(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        reviewsDb
          .findOne({ userId: user._id }, { reviews: 1 })
          .then(reviews => {
            return res.send({ success: reviews });
          });
      })
      .catch(() => {
        // io.socket.emit('serverError', "Ups, įvyko serverio klaida")
      });
  },

  getOwnSales(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        soldDb.findOne({ userId: user._id }).then(auctions => {
          return res.send({ success: auctions });
        });
      })
      .catch(() => {
        // io.socket.emit('serverError', "Ups, įvyko serverio klaida")
      });
  },

  otherUserReviews(req, res) {
    reviewsDb
      .findOne({ userId: xss(req.headers.id) }, { reviews: 1 })
      .then(reviews => {
        if (reviews) {
          return res.send({ success: reviews.reviews });
        }

        return res.send({ success: [] });
      });
  },

  otherUserSales(req, res) {
    soldDb
      .findOne({ userId: xss(req.headers.id) }, { soldAuctions: 1 })
      .then(sold => {
        if (sold) {
          return res.send({ success: sold.soldAuctions });
        }

        return res.send({ success: [] });
      });
  }
};
