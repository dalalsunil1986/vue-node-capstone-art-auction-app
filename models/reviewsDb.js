const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewsSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  allPoints: { type: Number },
  reviews: []
});
reviewsSchema.index({ userId: 1 });
const reviews = mongoose.model("reviews", reviewsSchema);
module.exports = reviews;
