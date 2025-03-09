import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import custom CSS

const App = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [finalBill, setFinalBill] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("https://restaurant-management-backend-delta.vercel.app/api/menu");
        const availableItems = res.data.filter(item => item.available);
        setMenu(availableItems);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, []);

  // ✅ Add item to cart (increase quantity if already added)
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // ✅ Remove item from cart
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item._id !== id));
  };

  // ✅ Calculate total price
  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Place Order & Save Order ID
  const placeOrder = async () => {
    if (!customerName || !tableNumber || cart.length === 0) {
      alert("❌ Please enter your name, table number, and add items!");
      return;
    }
    try {
      const orderItems = cart.map(({ name, price, quantity }) => ({ name, price, quantity }));
      const res = await axios.post("https://restaurant-management-backend-delta.vercel.app/api/orders", {
        customerName,
        tableNumber,
        items: orderItems,
      });

      setOrderId(res.data.orderId);
      alert(`✅ Order placed! Your Order ID: ${res.data.orderId}`);

      setCart([]); // Clear cart after order
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Failed to place order.");
    }
  };

  // ✅ Track Order & Display Order Details
  const trackOrder = async () => {
    if (!orderId.trim()) {
      alert("⚠️ Please enter your Order ID!");
      return;
    }

    try {
      const res = await axios.get(`https://restaurant-management-backend-delta.vercel.app/api/orders/${orderId.trim()}`);
      const orderData = res.data;

      setOrderDetails(orderData);
      setOrderStatus(orderData.status);

      // Show final bill only if order is completed
      if (orderData.status === "Completed") {
        setFinalBill({
          customerName: orderData.customerName,
          tableNumber: orderData.tableNumber,
          items: orderData.items,
          total: orderData.total,
        });
      } else {
        setFinalBill(null); // Hide final bill if order is not completed
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      alert("❌ Order not found!");
      setOrderDetails(null);
      setFinalBill(null);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial" }}>
      <h2>📜 Restaurant Menu</h2>

      <input type="text" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      <input type="number" placeholder="Table Number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />

      <h3>🍽 Available Menu</h3>
      {menu.length > 0 ? (
        menu.map((item) => (
          <div key={item._id} style={{ marginBottom: "5px" }}>
            {item.name} - ₹{item.price}{" "}
            <button onClick={() => addToCart(item)}> ➕ </button>
          </div>
        ))
      ) : (
        <p>Loading menu or no items available...</p>
      )}

      <h3>🛒 Your Cart</h3>
      {cart.length > 0 ? (
        cart.map((item) => (
          <div key={item._id}>
            {item.name} - ₹{item.price} × {item.quantity}{" "}
            <button onClick={() => removeFromCart(item._id)}>❌</button>
          </div>
        ))
      ) : (
        <p>No items added</p>
      )}
      <p><strong>Total: ₹{calculateTotal()}</strong></p>

      <button onClick={placeOrder}>✅ Place Order</button>

      <h3>📦 Track Your Order</h3>
      <input type="text" placeholder="Enter Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
      <button onClick={trackOrder}>🔍 Track</button>

      {orderDetails && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black", borderRadius: "5px" }}>
          <h3>📋 Order Details</h3>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Customer Name:</strong> {orderDetails.customerName}</p>
          <p><strong>Table Number:</strong> {orderDetails.tableNumber}</p>
          <h4>Items Ordered:</h4>
          {orderDetails.items.map((item, index) => (
            <p key={index}>{item.name} - ₹{item.price} × {item.quantity}</p>
          ))}
          <p><strong>Total:</strong> ₹{orderDetails.total}</p>
          <p><strong>Status:</strong> {orderStatus}</p>
        </div>
      )}

      {finalBill && (
        <div style={{ marginTop: "20px", padding: "10px", border: "2px solid green", borderRadius: "5px" }}>
          <h3>🧾 Final Bill</h3>
          <p><strong>Name:</strong> {finalBill.customerName}</p>
          <p><strong>Table:</strong> {finalBill.tableNumber}</p>
          <h4>Items Ordered:</h4>
          {finalBill.items.map((item, index) => (
            <p key={index}>{item.name} - ₹{item.price} × {item.quantity}</p>
          ))}
          <h4>Total: ₹{finalBill.total}</h4>
        </div>
      )}
    </div>
  );
};

export default App;
