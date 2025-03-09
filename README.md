# 🍽 Restaurant Management System

## 📝 Overview
The **Restaurant Management System** is a full-stack application built using the **MERN stack**. It provides two UIs:
1. **Customer UI**: Allows customers to view the menu, add items to their cart, place orders, and track orders using an Order ID.
2. **Admin UI**: Enables restaurant admins to manage orders, update order status, and control menu availability.

---

## 🚀 Features

### ✅ **Customer UI**
- Customers **scan a QR code** to access the menu.
- Enter **Name** and **Table Number** before ordering.
- View available menu items and add them to the cart.
- See the **total bill amount** before placing an order.
- **Track orders** by entering an Order ID.
- View **final bill** if the order is **completed**.

### ✅ **Admin UI**
- View **incoming orders** categorized by table number.
- Update **order status**: `Accepted` → `Preparing` → `Completed`.
- Toggle menu **item availability** (only available items are shown to customers).
- Track **order history** using an **Order ID**.

---

## 🛠 Tech Stack
- **Frontend**: React.js, CSS, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API Testing**: Postman

---

## API Endpoints :

- **Get Menu Items**: https://restaurant-management-backend-delta.vercel.app/api/menu
- **Get All Orders**: https://restaurant-management-backend-delta.vercel.app/api/orders
- **Get Specific Orders**: https://restaurant-management-backend-delta.vercel.app/api/orders/<id>


---

## Links :

- **User**: https://restaurant-management-client-sigma.vercel.app/
- **Admin**: https://restaurant-management-admin-kohl.vercel.app/


