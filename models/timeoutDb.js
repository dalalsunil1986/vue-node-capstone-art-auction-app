const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timeoutSchema = new Schema({
  time: {
    type: String,
    required: true
  },
  postId: {
    type: String,
    required: true
  }
});
timeoutSchema.index({ postId: 1 });
const timeout = mongoose.model("timeout", timeoutSchema);
module.exports = timeout;
