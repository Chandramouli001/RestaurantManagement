const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  tableNumber: Number,
  items: [{ name: String, price: Number }],
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Order", OrderSchema);
