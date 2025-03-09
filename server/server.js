const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://chandramouli:Password123@cluster0.rrsf2.mongodb.net/restaurant", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const MenuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  available: { type: Boolean, default: true },
});

const OrderSchema = new mongoose.Schema({
  customerName: String,
  tableNumber: Number,
  items: [{ name: String, price: Number, quantity: Number }],
  total: Number, // ✅ Store total price in DB
  status: { type: String, default: "Pending" },
});

const Menu = mongoose.model("Menu", MenuSchema);
const Order = mongoose.model("Order", OrderSchema);

// ✅ Get Menu
app.get("/api/menu", async (req, res) => {
  try {
    const menu = await Menu.find({ available: true });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

// ✅ Place Order (Now Stores Total Price)
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, tableNumber, items } = req.body;
    if (!customerName || !tableNumber || items.length === 0) {
      return res.status(400).json({ error: "Missing order details" });
    }

    // ✅ Calculate total price
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({ customerName, tableNumber, items, total });
    await order.save();

    res.json({ orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

// ✅ Get All Orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Get Order by ID
app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({
      orderId: order._id,
      customerName: order.customerName,
      tableNumber: order.tableNumber,
      items: order.items, // Includes name, price, and quantity
      total: order.total, // ✅ Retrieve total price from DB
      status: order.status,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update Order Status
app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status;
      await order.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error while deleting order" });
  }
});


// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
