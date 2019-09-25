const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const soldAuctionsSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  soldAuctions: []
});
soldAuctionsSchema.index({ userId: 1 });
const soldAuctons = mongoose.model("sold_auctions", soldAuctionsSchema);
module.exports = soldAuctons;
