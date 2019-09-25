const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  contacts: {
    name: { type: String },
    city: { type: String },
    phone: { type: String }
  },
  picture: { type: String },
  description: { type: String },
  upload: { type: Boolean },
  rating: { type: Number },
  reviewTokens: [],
  notifications: [],
  watching: [],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = "auth";
  let token = jwt
    .sign({ _id: user._id.toHexString(), access }, process.env.SESSION_KEY)
    .toString();
  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByToken = function(token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.SESSION_KEY);
  } catch (e) {
    //MAKE SOME KIND OF ERROR HANDLER
    console.log(e);
  }
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

const user = mongoose.model("user", userSchema);

module.exports = user;
