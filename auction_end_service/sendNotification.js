// const dbNotifications = require('../models/notificationsDb')
const dbUser = require("../models/userDb");
const redis = require("../models/redis_Db");

function sendNotification(post, seller, buyer, photo) {
  if (!buyer.id) {
    redis.notification(seller.id, {
      postPhoto: photo,
      postId: post.id,
      sold: false,
      time: Date.now()
    });
    return dbUser.findOneAndUpdate(
      {
        _id: seller.id
      },
      {
        $push: {
          notifications: {
            postPhoto: photo,
            postId: post.id,
            sold: false,
            time: Date.now()
          }
        }
      }
    );
  } else {
    redis.notification(seller.id, {
      postPhoto: photo,
      postId: post.id,
      sold: true,
      seller: true,
      buyerId: buyer.id,
      time: Date.now()
    });

    dbUser
      .findOneAndUpdate(
        {
          _id: seller.id
        },
        {
          $push: {
            notifications: {
              postPhoto: photo,
              postId: post.id,
              sold: true,
              seller: true,
              buyerId: buyer.id,
              time: Date.now()
            }
          }
        }
      )
      .then(() => {
        //SAVE USER TO REDIS
        redis.notification(buyer.id, {
          postPhoto: photo,
          postId: post.id,
          sold: false,
          seller: false,
          sellerId: seller.id,
          time: Date.now()
        });

        return dbUser.findOneAndUpdate(
          {
            _id: buyer.id
          },
          {
            $push: {
              notifications: {
                postPhoto: photo,
                postId: post.id,
                sold: false,
                seller: false,
                sellerId: seller.id,
                time: Date.now()
              }
            }
          }
        );
        //SAVE USER TO REDIS
      });
  }
}

module.exports = sendNotification;
