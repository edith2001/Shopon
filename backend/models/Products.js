const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  title: String,
  imageURL: String,
  price: Number,
  rating: Number,
  category: String,
});

module.exports = mongoose.model("product", ProductSchema);
