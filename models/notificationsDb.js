const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
  userId: { type: String },
  postId: { type: String },
  seller: { type: Boolean },
  sold: { type: Boolean }
});

const notification = mongoose.model("notification", notificationSchema);

notificationSchema.index({ postId: 1 });

module.exports = notification;
