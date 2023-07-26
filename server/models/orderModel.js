const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  product_name: { type: String, required: true },
  product_id: { type: String, required: true },
  purchased: { type: Boolean, required: true },
  buyerId: String,
  amount: Number,
  sellerId: String,
  order_id: { type: String, required: true },
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
