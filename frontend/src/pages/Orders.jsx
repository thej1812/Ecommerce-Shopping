import { API_URL } from "../utils/api.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
    };
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => res.json())
        .then(data => setOrders(data));
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    await fetch(
      `${API_URL}/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({ status: newStatus })
      }
    );

    setOrders(prev =>
      prev.map(order =>
        order._id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <section>
      {/* TOP ADMIN NAV */}
      <div className=" sticky top-0 bg-white w-full border-b border-black px-10 py-4 flex items-center justify-between font-light ">
        {/* LOGO */}
         <Link to="/admin">
          <img src="/logo.png" alt="logo" className="h-14" />
        </Link>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline cursor-pointer"
        >
          Logout
        </button>
      </div>

    <section className="py-8 px-6 font-[Mulish]">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-[italiana]">
          Admin Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage customer orders and delivery status
        </p>
      </div>

      {orders.length === 0 && (
        <p className="text-center text-gray-500">
          No orders found
        </p>
      )}

      {/* ORDERS */}
      <div className="max-w-5xl mx-auto space-y-8">
        {orders.map(order => (
          <div
            key={order._id}
            className="border  p-6 bg-white hover:shadow-md transition"
          >
            {/* USER INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
              <p><span className="font-medium">Name:</span> {order.userName || "N/A"}</p>
              <p><span className="font-medium">Phone:</span> {order.phone || "N/A"}</p>
              <p><span className="font-medium">Address:</span> {order.address || "N/A"}</p>
            </div>

            {/* TOTAL + STATUS */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <p className="text-sm">
                <span className="font-medium">Total:</span> ₹{order.totalAmount}
              </p>

              <p className="text-sm">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    order.status === "Cancelled"
                      ? "text-red-600 font-medium"
                      : order.status === "Delivered"
                      ? "text-green-600 font-medium"
                      : order.status === "Shipped"
                      ? "text-blue-600 font-medium"
                      : "text-yellow-600 font-medium"
                  }
                >
                  {order.status}
                </span>
              </p>
            </div>

            {/* PRODUCTS */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium mb-2">
                Products
              </p>

              {order.products?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 text-sm"
                >
                  {/* PRODUCT IMAGE */}
                  {item?.images?.length > 0 && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  )}

                  {/* PRODUCT INFO */}
                  <p>
                    {item?.name || "Product"} × {item?.qty || 1}
                  </p>
                </div>
              ))}
            </div>

            {/* ADMIN ACTION */}
            {order.status !== "Cancelled" && (
              <select
                className="mt-4 border px-3 py-2 text-sm"
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

            {/* CANCEL LABEL */}
            {order.status === "Cancelled" && (
              <p className="mt-4 text-red-600 font-medium">
                Order Cancelled by User
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
    </section>
  );
}
