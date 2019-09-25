const userDb = require("../models/userDb");
// const xssFilters = require('xss-filters')
const SHA2 = require("sha2");
// const io = require("../helpers/res_errors");
const xss = require("../helpers/xssFilters");
const redis = require("../models/redis_Db");

module.exports = {
  registerUser(req, res) {
    let user = new userDb({
      username: xss(req.body.username),
      email: xss(req.body.email),
      password: xss(SHA2.SHA224(req.body.password)),
      picture: "https://myspace.com/common/images/user.png",
      rating: 0,
      sales: 0,
      reviews: 0,
      activeAuctions: 0,
      description: "My profile",
      watching: []
    });

    user
      .save()
      .then(() => {
        return user.generateAuthToken();
      })
      .then(() => {
        res.send("ok");
      })
      .catch(e => {
        console.log(e);
        //io.socket.emit("serverError", "Username or email already exists");
      });
  },
  login(req, res) {
    let cred = {
      email: xss(req.body.email),
      password: xss(SHA2.SHA224(req.body.password))
    };

    userDb
      .findOne({
        email: cred.email,
        password: cred.password
      })
      .then(user => {
        if (user) {
          req.session.token = user.tokens[0].token;

          //DO NOT USE REDIS WITH MONGODB

          // redis.setUser({
          //     userId: user._id,
          //     username: user.username,
          //     email: user.email,
          //     rating: user.rating,
          //     description: user.description,
          //     picture: user.picture,
          //     watching: user.watching,
          //     notifications: user.notifications,
          // })

          // redis.get(user._id.toString(), (err, obj) => {
          //     console.log(obj)
          // })

          // redis.HGET('USER', user._id.toString(), (err, obj) => {
          //     console.log(obj)
          // })

          // redis.del(user._id.toString(), (err, obj) => {
          //     console.log('deleted succesfully')
          // })

          // redis.SETEX(user._id.toString(), 60, 'labas', (err, obj) => {
          //     console.log(obj)
          // })

          // redis.HSET('SOCKET', user._id.toString(), 'labas', (err, obj) => {
          //     console.log(obj)
          // })

          // redis.HSET('USER', user._id.toString(), user.toString(), (err, obj) => {
          //     console.log(obj)
          // })
          return res.send({
            user: {
              Id: user._id,
              username: user.username,
              email: user.email,
              rating: user.rating,
              description: user.description,
              picture: user.picture,
              watching: user.watching,
              notifications: user.notifications
            }
          });
        } else {
          // io.socket.emit("serverError", "User does not exist");
        }
      });
  },

  logout(req, res) {
    req.session.destroy();
    console.log(req.session);
    //REMOVE SOCKET FROM SOCKET USERS FILE
    return res.send({
      success: true
    });
  },

  loginWithToken(req, res) {
    // userDb.findByToken(req.headers.token).then((user) => {
    //     if(user) {
    //         res.send({
    //             user: {
    //                 Id: user._id,
    //                 username: user.username,
    //                 email: user.email,
    //                 rating: user.rating,
    //                 description: user.description,
    //                 picture: user.picture,
    //                 watching: user.watching
    //             },
    //             token: user.tokens[0].token
    //         })
    //     } else {
    //         io.socket.emit('serverError', "User does not exist")
    //     }
    // })
  }
};
