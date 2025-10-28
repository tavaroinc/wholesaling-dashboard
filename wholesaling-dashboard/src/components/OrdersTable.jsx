import React, { useState, useEffect } from "react";
import { generateOrder } from "../data/liveOrders";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Add a new order every 4 seconds
    const interval = setInterval(() => {
      setOrders(prevOrders => [generateOrder(), ...prevOrders]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = status => {
    switch (status) {
      case "Pending": return "orange";
      case "Processing": return "blue";
      case "Shipped": return "purple";
      case "Delivered": return "green";
      default: return "gray";
    }
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Status</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id} style={{ transition: "all 0.5s ease" }}>
            <td>{order.id}</td>
            <td>{order.product}</td>
            <td>{order.quantity}</td>
            <td style={{ color: getStatusColor(order.status), fontWeight: "bold" }}>
              {order.status}
            </td>
            <td>{order.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
