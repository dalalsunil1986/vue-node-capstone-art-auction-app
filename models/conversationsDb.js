const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conversationSchema = new Schema({
  participants: []
});

const conversation = mongoose.model("conversation", conversationSchema);

module.exports = conversation;
