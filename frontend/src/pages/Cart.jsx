import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, total } =
    useContext(CartContext);

  if (cart.length === 0) {
    return <p className="p-6">Cart is empty</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Cart</h1>

      {cart.map(item => (
        <div key={item._id} className="border p-4 mb-3">
          <h2>{item.name}</h2>
          <p>₹{item.price}</p>

          <div className="flex gap-3 items-center">
            <button onClick={() => decreaseQty(item._id)}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => increaseQty(item._id)}>+</button>
          </div>
        </div>
      ))}

      <h2 className="font-bold mt-4">Total: ₹{total}</h2>

      <Link
        to="/checkout"
        className="inline-block mt-4 bg-black text-white px-4 py-2"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
