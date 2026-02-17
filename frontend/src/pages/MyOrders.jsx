import { API_URL } from "../utils/api.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // UI ONLY – cancel modal state
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect to login if not authenticated
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = () => {
      fetch(`${API_URL}/api/orders/my`, {
        headers: {
          Authorization: token
        }
      })
        .then(res => {
          if (res.status === 401) {
            // Token is invalid, redirect to login
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          return res.json();
        })
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

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  const confirmCancel = async () => {
    await fetch(
      `${API_URL}/api/orders/${cancelId}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    setOrders(prev =>
      prev.map(o =>
        o._id === cancelId
          ? { ...o, status: "Cancelled" }
          : o
      )
    );

    setCancelId(null);
  };

  if (loading) {
    return (
      <p className="p-6 text-gray-500 font-[Mulish]">
        Loading orders...
      </p>
    );
  }

  return (
    <section className="pt-8 px-6 pb-8 font-[Mulish]">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-[italiana]">
          My Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and manage your recent purchases
        </p>
      </div>

      {/* EMPTY */}
      {orders.length === 0 && (
        <p className="text-center text-gray-500">
          No orders yet
        </p>
      )}

      {/* ORDERS */}
      <div className="max-w-4xl mx-auto space-y-6">
        {orders.map(order => (
          <div
            key={order._id}
            className="border p-6 bg-white hover:shadow-md transition"
          >
            {/* META */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Total:</span> ₹{order.totalAmount}
              </p>

              <p className="text-sm">
                <span className="font-medium">Status:</span>{" "}
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
            </div>

            {/* ADDRESS */}
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium text-gray-800">
                Address:
              </span>{" "}
              {order.address}
            </p>

            {/* PRODUCTS */}
            <div className="border-t pt-4 space-y-1">
              {order.products.map((p, i) => (
                <p
                  key={i}
                  className="text-sm text-gray-700"
                >
                  {p.name} × {p.qty}
                </p>
              ))}
            </div>

            {/* CANCEL */}
            {order.status === "Placed" && (
              <button
                className="mt-4 text-sm text-red-500 hover:underline"
                onClick={() => setCancelId(order._id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 🔴 CANCEL CONFIRMATION MODAL */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-medium mb-2">
              Cancel Order
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this order?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="px-4 py-2 border text-sm"
              >
                Keep Order
              </button>

              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white text-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
