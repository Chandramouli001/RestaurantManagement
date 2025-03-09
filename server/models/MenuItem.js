const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
