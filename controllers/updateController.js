const multer = require("../middleware/cloudinaryStorage");
const userDb = require("../models/userDb");
const productDb = require("../models/productDb");
const timeoutDb = require("../models/timeoutDb");
const conversationDb = require("../models/conversationsDb");
const messagesDb = require("../models/messagesDb");
const xss = require("../helpers/xssFilters");
const redis = require("../models/redis_Db");
const resError = require("../helpers/res_errors");
const reviewsDb = require("../models/reviewsDb");
const soldDb = require("../models/soldDb");

const verifyUser = require("../middleware/verifyUserByToken");

module.exports = {
  updateDescription: function(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        userDb
          .findOneAndUpdate(
            {
              _id: user._id
            },
            {
              $set: { description: xss(req.body.description) }
            }
          )
          .then(() => {
            res.send({ success: true });
          });
      })
      .catch(() => {
        return resError(res, "User info error");
      });
  },

  updatePicture(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        multer(req, res, err => {
          if (err) {
            return resError(res, "Invalid file format");
          }

          userDb
            .findOneAndUpdate(
              {
                _id: user._id
              },
              {
                $set: { picture: req.files[0].secure_url }
              }
            )
            .then(() => {
              res.send({ success: req.files[0].secure_url });
            });
        });
      })
      .catch(() => {
        return resError(res, "User data is Invalid");
      });
  },

  newAuction(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        multer(req, res, err => {
          if (err) {
            return resError(res, "Oops, a server error has occured.");
          }
          // 86400000 = ONE DAY
          let actionTime = 10000;
          let photos = req.files.map(x => x.secure_url);
          let product = new productDb();
          product.title = xss(req.body.title);
          product.category = xss(req.body.category);
          product.description = xss(req.body.description);
          product.city = xss(req.body.city);
          product.price = xss(parseInt(req.body.price));
          product.time =
            Date.now() + actionTime * Number(xss(parseInt(req.body.time)));
          product.shipping = xss(!!req.body.shipping);
          product.handToHand = xss(!!req.body.handTohand);
          product.photos = photos;
          product.userId = user._id;
          product.active = true;
          product.save();
          let tm =
            Date.now() + actionTime * Number(xss(parseInt(req.body.time)));
          let tm1 = tm.toString().slice(0, -3);
          let timeout = new timeoutDb();
          timeout.time = tm1;
          timeout.postId = product._id;
          timeout.save();
          return res.send({ success: true });
        });
      })
      .catch(() => {
        return resError(res, "User data error");
      });
  },

  addFavorites(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        let postId = xss(req.body.postId);
        userDb
          .findOne({ _id: user._id, watching: { $all: postId } })
          .then(usr => {
            if (!usr) {
              userDb
                .findOneAndUpdate(
                  { _id: user._id },
                  { $push: { watching: postId } },
                  { new: true }
                )
                .then(() => {
                  return res.send({ success: true });
                });
            } else {
              return resError(
                res,
                "This auction is already in your watch list"
              );
            }
          });
      })
      .catch(() => {
        return resError(res, "User data error");
      });
  },

  removeFavorites(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        userDb
          .findOneAndUpdate(
            { _id: user._id },
            { $pull: { watching: xss(req.body.postId) } },
            { new: true }
          )
          .then(() => {
            return res.send({ success: true });
          });
      })
      .catch(() => {
        return resError(res, "User data error");
      });
  },

  makeBid(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        let price = xss(req.body.price);
        let prodId = xss(req.body.postId);
        productDb.findOne({ _id: prodId }).then(product => {
          //IF TIME NOW < TIMESTAMP
          if (Date.now() >= product.time) {
            return resError(res, "The auction time ended");
          }
          if (!product.active) {
            return resError(res, "The auction time ended");
          }
          if (product.price > price) {
            return resError(res, "Bid amount is too low");
          }
          if (user._id === product.userId) {
            return resError(res, "You cannot bid on your own auction");
          }
          let inc = price - product.price;
          productDb
            .findOneAndUpdate(
              { _id: prodId },
              {
                $inc: { price: Number(inc) },
                $push: {
                  bids: {
                    username: user.username,
                    bid: Number(price),
                    time: Date.now(),
                    userId: user._id
                  }
                }
              },
              { new: true }
            )
            .then(prod => {
              //ADD TO REDIS
              redis.bidOnAuctionEmit(prodId, {
                username: user.username,
                bid: Number(price),
                time: Date.now(),
                userId: user._id
              });
              //EMIT TO ALL SOCKETS IN CURRENT AUCTION
              return res.send({
                success: prod
              });
            });
        });
      })
      .catch(() => {
        return resError(res, "User error");
      });
  },

  sendMessage(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        let participants = [String(user._id), xss(req.body.to)];

        let msg = {
          sender: user.username,
          message: xss(req.body.message),
          timestamp: Date.now()
        };

        conversationDb
          .find({ participants: { $all: participants } })
          .then(conversation => {
            if (conversation.length < 1) {
              let conv = new conversationDb();
              conv.participants = participants;
              conv.save();
              let message = new messagesDb();
              message.conversationId = conv._id;
              message.content = [msg];
              message.save();
              redis.message(participants[0], participants[1], msg);
              return res.send({ success: true });
            } else {
              messagesDb
                .findOneAndUpdate(
                  {
                    conversationId: conversation[0]._id
                  },
                  {
                    $push: { content: msg }
                  },
                  { new: true }
                )
                .then(() => {
                  redis.message(participants[0], participants[1], msg);
                  return res.send({ success: msg });
                });
            }
          });
      })
      .catch(() => {
        return resError(res, "User data error");
      });
  },

  deleteConversation(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        messagesDb
          .findOneAndDelete({ conversationId: xss(req.body.id) })
          .then(() => {
            //MAYBE COPY CONVERSATION TO SOMEWHERE BEFORE DELETE?
            conversationDb
              .findOneAndDelete({ _id: xss(req.body.id) })
              .then(() => {
                return res.send({ success: true });
              });
          });
      })
      .catch(() => {
        return resError(res, "User data error");
      });
  },

  renewPost(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        let tm = 604800000 + Date.now();
        let tm1 = tm.toString().slice(0, -3);

        userDb
          .findOneAndUpdate(
            { _id: user._id },
            {
              $pull: {
                notifications: {
                  postId: xss(req.body.id)
                }
              }
            }
          )
          .then(() => {
            productDb
              .findOneAndUpdate(
                { _id: xss(req.body.id) },
                {
                  $set: {
                    active: true,
                    time: tm
                  }
                },
                { new: true }
              )
              .then(post => {
                let timeout = new timeoutDb();
                timeout.time = tm1;
                timeout.postId = post._id;
                timeout.save();
                return res.send({
                  success: {
                    post: post
                  }
                });
              });
          });
      })
      .catch(() => {
        return resError(res, "User data error");
      });
  },

  deletePost(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        userDb
          .findOneAndUpdate(
            { _id: user._id },
            {
              $pull: {
                notifications: {
                  postId: xss(req.body.id)
                }
              }
            }
          )
          .then(() => {
            productDb.findOneAndDelete({ _id: xss(req.body.id) }).then(() => {
              return res.send({ success: true });
            });
          });
      })
      .catch(() => {
        return resError(res, "User data error");
      });
  },

  makereview(req, res) {
    verifyUser(req.session.token)
      .then(user => {
        let usr = xss(req.body.userId);
        let auction = xss(req.body.auctionId);
        let rev = xss(req.body.review);
        let revPoints = Number(xss(req.body.points));
        userDb
          .find(
            { _id: user._id },
            {
              reviewTokens: {
                $elemMatch: {
                  user: usr,
                  post: auction
                }
              }
            }
          )
          .then(review => {
            if (review[0].reviewTokens.length < 1) {
              return resError(res, "You cannot perform this action");
            }
            //ADD POINTS TO USER --
            //REMOVE TOKEN WHEN REVIEW MADE --
            //REMOVE NOTIFICATION WHEN REVIEW MADE --
            //SEND REVIEW WITH SOCKETS
            //MAKE REVIEW NOTIFICATION
            //MAKE SOMETHING WITH THE POST AFTER TWO REVIEWS
            reviewsDb.findOne({ userId: usr }).then(reviewInDb => {
              if (!reviewInDb) {
                productDb.findOne({ _id: auction }).then(prd => {
                  let rw = new reviewsDb();
                  rw.userId = usr;
                  rw.allPoints = revPoints;
                  rw.reviews = [
                    {
                      postPhoto: prd.photos[0],
                      postTitle: prd.title,
                      username: user.username,
                      userId: String(user._id),
                      userPhoto: user.picture,
                      review: rev,
                      points: revPoints,
                      time: Date.now()
                    }
                  ];
                  rw.save().then(() => {
                    reviewsDb
                      .aggregate([
                        {
                          $match: { userId: String(usr) }
                        },
                        {
                          $project: {
                            allPoints: 1,
                            size: { $size: "$reviews" }
                          }
                        }
                      ])
                      .then(size => {
                        let rating = Math.ceil(
                          size[0].allPoints / size[0].size
                        );
                        userDb
                          .findOneAndUpdate(
                            { _id: usr },
                            {
                              $set: { rating: rating }
                            }
                          )
                          .then(() => {
                            userDb
                              .findOneAndUpdate(
                                { _id: user._id },
                                {
                                  $pull: {
                                    reviewTokens: {
                                      user: usr,
                                      post: auction
                                    },
                                    notifications: {
                                      postId: auction
                                    }
                                  }
                                },
                                { new: true }
                              )
                              .then(newUser => {
                                return res.send({
                                  success: true,
                                  notifications: newUser.notifications
                                });
                              });
                          });
                      });
                  });
                });
              } else {
                productDb.findOne({ _id: auction }).then(prd => {
                  reviewsDb
                    .findOneAndUpdate(
                      { userId: usr },
                      {
                        $push: {
                          reviews: {
                            postPhoto: prd.photos[0],
                            postTitle: prd.title,
                            username: user.username,
                            userId: String(user._id),
                            userPhoto: user.picture,
                            review: rev,
                            points: revPoints,
                            time: Date.now()
                          }
                        },
                        $inc: {
                          allPoints: revPoints
                        }
                      }
                    )
                    .then(() => {
                      reviewsDb
                        .aggregate([
                          {
                            $match: { userId: String(usr) }
                          },
                          {
                            $project: {
                              allPoints: 1,
                              size: { $size: "$reviews" }
                            }
                          }
                        ])
                        .then(size => {
                          let rating = Math.ceil(
                            size[0].allPoints / size[0].size
                          );
                          userDb
                            .findOneAndUpdate(
                              { _id: usr },
                              {
                                $set: { rating: rating }
                              }
                            )
                            .then(() => {
                              userDb
                                .findOneAndUpdate(
                                  { _id: user._id },
                                  {
                                    $pull: {
                                      reviewTokens: {
                                        user: usr,
                                        post: auction
                                      },
                                      notifications: {
                                        postId: auction
                                      }
                                    }
                                  },
                                  { new: true }
                                )
                                .then(newUser => {
                                  return res.send({
                                    success: true,
                                    notifications: newUser.notifications
                                  });
                                });
                            });
                        });
                    });
                });
              }
            });
          });
      })
      .catch(() => {
        return resError(res, "User data error");
      });

    // reviewsDb.find({userId: })
  }

  // editProfileInfo(data, token) {
  //     multer(data).then((photo)=> {
  //         console.log(photo)
  //     })
  // }
};
