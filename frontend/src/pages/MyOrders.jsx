import { API_URL } from "../utils/api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch(`${API_URL}/api/orders/my`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });

      alert("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-50";
      case "Shipped":
        return "text-blue-600 bg-blue-50";
      case "Cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-[Mulish]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-[italiana]">My Orders</h1>
          <p className="text-sm text-gray-500 mt-2">
            Track and manage your orders
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
            <Link
              to="/products"
              className="inline-block bg-black text-white px-6 py-3  hover:bg-white hover:text-black hover:border hover:border-black transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID: {order._id}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Delivery Address</p>
                      <p className="font-medium">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Amount</p>
                      <p className="font-medium text-lg">₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-4">
                  <p className="font-medium text-gray-700">Products:</p>
                  {order.products?.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {/* Product Image */}
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${product._id}`}
                          className="font-medium text-gray-800 hover:text-black"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {product.qty || 1} × ₹{product.price}
                        </p>
                      </div>

                      {/* Review Button - Only show if order is delivered */}
                      {order.status === "Delivered" && (
                        <Link
                          to={`/add-review/${product._id}/${order._id}`}
                          className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition"
                        >
                          Add Review
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Cancel Button */}
                {order.status === "Placed" && (
                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
