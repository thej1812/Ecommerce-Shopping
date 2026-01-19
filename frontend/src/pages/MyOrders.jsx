import { useEffect, useState } from "react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = () => {
      fetch("http://localhost:5000/api/orders/my", {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            setOrders([]);
          }
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    };

    fetchOrders(); // initial load

    const interval = setInterval(fetchOrders, 3000); // live update every 3 sec

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="p-6">Loading orders...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (
        <div
          key={order._id}
          className="border p-4 mb-4 rounded"
        >
          <p>
            <b>Total:</b> ₹{order.totalAmount}
          </p>

          <p>
            <b>Status:</b>{" "}
            <span
              className={
                order.status === "Cancelled"
                  ? "text-red-500"
                  : order.status === "Delivered"
                  ? "text-green-600"
                  : "text-yellow-600"
              }
            >
              {order.status}
            </span>
          </p>

          <p>
            <b>Address:</b> {order.address}
          </p>

          <div className="mt-2">
            {order.products.map((p, i) => (
              <p key={i}>
                {p.name} × {p.qty}
              </p>
            ))}
          </div>

          {/* USER CANCEL ORDER */}
          {order.status === "Placed" && (
            <button
              className="mt-2 text-red-500"
              onClick={async () => {
                await fetch(
                  `http://localhost:5000/api/orders/${order._id}/cancel`,
                  {
                    method: "PUT",
                    headers: {
                      Authorization: localStorage.getItem("token")
                    }
                  }
                );

                setOrders(prev =>
                  prev.map(o =>
                    o._id === order._id
                      ? { ...o, status: "Cancelled" }
                      : o
                  )
                );
              }}
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
