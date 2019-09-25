const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  photos: [],
  description: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  time: {
    type: String,
    required: true
  },
  shipping: { type: Boolean },
  handToHand: { type: Boolean },
  userId: {
    type: String,
    required: true
  },
  bids: [],
  bidsAmount: { type: Number, index: true },
  active: { type: Boolean },
  minimalBid: { type: String }
});

productSchema.index({
  category: 1,
  city: 1,
  bidsAmount: 1,
  price: 1,
  active: 1,
  time: 1
});

const product = mongoose.model("product", productSchema);

module.exports = product;
