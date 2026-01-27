import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const { cart, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/products");
    }
  }, [cart, navigate]);

  const placeOrder = async () => {
    // REQUIRED FIELD CHECK
    if (!details.name || !details.address || !details.phone) {
      setError("Please fill all required fields");
      return;
    }

    setError("");

    const orderData = {
      userId: localStorage.getItem("userId"),
      userName: details.name,
      phone: details.phone,
      address: details.address,
      products: cart,
      totalAmount: total
    };

    await fetch("https://ecommerce-shopping-k0ip.onrender.com/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    setSuccess(true);

    setTimeout(() => {
      clearCart();
      navigate("/my-orders");
    }, 2000);
  };

  return (
    <section className="py-8 px-6 font-[Mulish]">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-medium">
          Checkout
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete your order by filling the details below
        </p>
      </div>

      {/* FORM CARD */}
      <div className="max-w-xl mx-auto border p-8 bg-white hover:shadow-md transition">
        {/* NAME */}
        <input
          placeholder="Full Name *"
          value={details.name}
          className="w-full border-b border-gray-300 focus:border-black outline-none py-2 mb-6 text-sm"
          onChange={e =>
            setDetails({ ...details, name: e.target.value })
          }
        />

        {/* ADDRESS */}
        <input
          placeholder="Delivery Address *"
          value={details.address}
          className="w-full border-b border-gray-300 focus:border-black outline-none py-2 mb-6 text-sm"
          onChange={e =>
            setDetails({ ...details, address: e.target.value })
          }
        />

        {/* PHONE */}
        <input
          placeholder="Phone Number *"
          value={details.phone}
          className="w-full border-b border-gray-300 focus:border-black outline-none py-2 mb-6 text-sm"
          onChange={e =>
            setDetails({ ...details, phone: e.target.value })
          }
        />

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center">
            Order placed successfully.
          </p>
        )}

        {/* TOTAL */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Order Total
          </p>
          <p className="text-lg font-medium">
            ₹{total}
          </p>
        </div>

        {/* PLACE ORDER BUTTON */}
        <button
          onClick={placeOrder}
          disabled={success}
          className={`w-full py-3 text-sm transition ${
            success
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          {success ? "Order Placed" : "Place Order"}
        </button>
      </div>
    </section>
  );
}
