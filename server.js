const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// const interval = require("./auction_end_service/interval");

//REDIS
////ADD SECRET KEY TO REDIS
const redis = require("./models/redis_Db");
redis.redis.on("connect", () => {
  console.log("redis connected");
});
redis.redis.on("error", err => {
  console.log("Error " + err);
});

//SOCKET.IO
const io = require("socket.io")(server);
require("./helpers/socket_router")(io);

//MONGO DB
const MongoStore = require("connect-mongo")(session);
require("dotenv").config();
mongoose
  .connect(
    process.env.MONGO_KEY,
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log("Connection to MongoDB is ok");
    },
    err => {
      console.log("Connection to MongoDb failed" + err);
    }
  );
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("APP is listening on port " + port);
});
// app.use(express.static(__dirname + "/dist/"))
// app.get(/.*/, (req, res) => {
//     res.sendfile(__dirname + "/dist/index.html")
// })
app.use(
  cors({
    origin: ["http://localhost:8081"],
    methods: ["GET", "POST"],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    // cookie: {
    //     maxAge:30 * 60 * 1000,
    //     httpOnly: true
    // },
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
//ROUTES
const loginRouter = require("./routes/auth_router");
const updateRouter = require("./routes/update_router");
const getData = require("./routes/getData_router");
app.use(["/auth"], loginRouter);
app.use(["/update"], updateRouter);
app.use(["/get"], getData);

module.exports = app;
