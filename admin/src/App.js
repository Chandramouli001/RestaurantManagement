import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      fetchOrders();
      alert("🗑️ Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("❌ Failed to delete order.");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">📌 Admin Panel - Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => {
          // ✅ Calculate total amount
          const totalAmount = order.items.reduce((sum, item) => sum + item.price, 0);

          return (
            <div key={order._id} className="order-card">
              <h4>🧑 {order.customerName} | 📍 Table {order.tableNumber}</h4>
              <p className="order-status">Status: <strong>{order.status}</strong></p>
              <h5>🛒 Ordered Items:</h5>
              <ul className="order-items">
                {order.items.map((item, index) => (
                  <li key={index}>{item.name} - ₹{item.price}</li>
                ))}
              </ul>
              <p className="total-amount">💰 Total Amount: <strong>₹{totalAmount}</strong></p>
              <div className="order-buttons">
                <button className="accept-btn" onClick={() => updateStatus(order._id, "Accepted")}>✅ Accept</button>
                <button className="preparing-btn" onClick={() => updateStatus(order._id, "Preparing")}>🔄 Preparing</button>
                <button className="completed-btn" onClick={() => updateStatus(order._id, "Completed")}>✔️ Completed</button>
                <button className="delete-btn" onClick={() => deleteOrder(order._id)}>🗑️ Delete Order</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AdminPanel;
