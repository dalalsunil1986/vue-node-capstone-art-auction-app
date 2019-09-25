const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messagesSchema = new Schema({
  conversationId: { type: String },
  content: []
});

const messages = mongoose.model("messages", messagesSchema);

module.exports = messages;
