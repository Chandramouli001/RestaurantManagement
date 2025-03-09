const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/restaurant", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const MenuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  available: { type: Boolean, default: true },
});

const Menu = mongoose.model("Menu", MenuSchema);

// ✅ Add Indian Menu Items
const indianMenu = [
  { name: "Paneer Butter Masala", price: 250, available: true },
  { name: "Dal Tadka", price: 180, available: true },
  { name: "Chole Bhature", price: 150, available: true },
  { name: "Masala Dosa", price: 120, available: true },
  { name: "Biryani", price: 300, available: true },
  { name: "Butter Naan", price: 40, available: true },
  { name: "Gulab Jamun", price: 80, available: true },
  { name: "Rasgulla", price: 90, available: true },
];

const uploadMenu = async () => {
  try {
    const count = await Menu.countDocuments();
    if (count === 0) {
      await Menu.insertMany(indianMenu);
      console.log("✅ Indian menu items added!");
    } else {
      console.log("⚠️ Menu already exists. Skipping upload.");
    }
    process.exit();
  } catch (error) {
    console.error("❌ Error uploading menu:", error);
    process.exit(1);
  }
};

uploadMenu();
