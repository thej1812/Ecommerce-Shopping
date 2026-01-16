import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const fetchOrders = () => {
    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  fetchOrders(); // initial load

  const interval = setInterval(fetchOrders, 3000); // every 3 sec

  return () => clearInterval(interval); // cleanup
}, []);


  // UPDATE ORDER STATUS
  const updateStatus = async (orderId, newStatus) => {
    await fetch(
      `http://localhost:5000/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") // 🔑 SEND TOKEN
        },
        body: JSON.stringify({ status: newStatus })
      }
    );

    // Update UI immediately
    setOrders(prev =>
      prev.map(order =>
        order._id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Orders</h1>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map(order => (
        <div key={order._id} className="border p-4 mb-4">
          {/* USER DETAILS */}
          <p><b>Name:</b> {order.userName || "N/A"}</p>
          <p><b>Phone:</b> {order.phone || "N/A"}</p>
          <p><b>Address:</b> {order.address || "N/A"}</p>

          {/* TOTAL */}
          <p className="mt-2">
            <b>Total:</b> ₹{order.totalAmount}
          </p>

          {/* PRODUCTS */}
          <div className="mt-2">
            <b>Products:</b>
            {order.products?.map((item, index) => (
              <p key={index}>
                {item?.name || "Product"} × {item?.qty || 1}
              </p>
            ))}
          </div>

          {/* STATUS LABEL */}
          <p className="mt-2">
            <b>Status:</b>{" "}
            <span
              className={
                order.status === "Cancelled"
                  ? "text-red-600 font-bold"
                  : order.status === "Delivered"
                  ? "text-green-600"
                  : order.status === "Shipped"
                  ? "text-blue-600"
                  : "text-yellow-600"
              }
            >
              {order.status}
            </span>
          </p>

          {/* ADMIN STATUS CHANGE */}
          {order.status !== "Cancelled" && (
            <select
              className="border mt-2"
              value={order.status}
              onChange={e =>
                updateStatus(order._id, e.target.value)
              }
            >
              <option value="Placed">Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          )}

          {/* CANCEL LABEL FOR ADMIN */}
          {order.status === "Cancelled" && (
            <p className="mt-2 text-red-600 font-bold">
              ❌ Order Cancelled by User
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
