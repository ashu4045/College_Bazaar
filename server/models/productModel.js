const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, required: true },
  categories: { type: String, required: true },
  tags: Array,
  sellerId: String,
  approved: { type: Boolean, default: false },
  rating: { type: Number, default: -1 },
});
const Product = mongoose.model("product", productSchema);
module.exports = Product;
