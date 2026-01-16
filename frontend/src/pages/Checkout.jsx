import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const { cart, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [details, setDetails] = useState({});

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/products");
    }
  }, [cart, navigate]);
const placeOrder = async () => {
  const orderData = {
    userId: localStorage.getItem("userId"),
    userName: details.name,
    phone: details.phone,
    address: details.address,
    products: cart,
    totalAmount: total
  };

  await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });

  alert("Order placed successfully");
  clearCart();
  navigate("/my-orders");
};


  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Checkout</h1>

      <input
        placeholder="Name"
        className="block border p-2 my-2"
        onChange={e => setDetails({ ...details, name: e.target.value })}
      />

      <input
        placeholder="Address"
        className="block border p-2 my-2"
        onChange={e => setDetails({ ...details, address: e.target.value })}
      />
      <input
  placeholder="Phone Number"
  className="block border p-2 my-2"
  onChange={e => setDetails({ ...details, phone: e.target.value })}
/>

      <p className="mt-3 font-bold">Total: ₹{total}</p>

      <button
        onClick={placeOrder}
        className="bg-black text-white px-4 py-2 mt-3"
      >
        Place Order
      </button>
    </div>
  );
}
