import { API_URL } from "../utils/api.js";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, total } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <p className="p-6 text-center text-gray-500 font-[Mulish]">
        Cart is empty
      </p>
    );
  }

  return (
    <section className="pt-8 px-6 font-[Mulish] pb-8">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-[italiana]">
          My Cart
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your selected items before checkout
        </p>
      </div>

      {/* CART LIST */}
      <div className="max-w-4xl mx-auto space-y-6">
        {cart.map(item => (
          <div
            key={item._id}
            className="border p-6 bg-white hover:shadow-md transition"
          >
            <div className="flex gap-6 items-center">
              {/* PRODUCT IMAGE */}
              {item.images?.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-30 h-30 object-cover rounded"
                />
              )}

              {/* ITEM INFO + CONTROLS */}
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    ₹{item.price}
                  </p>
                </div>

                {/* QUANTITY CONTROL */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  >
                    −
                  </button>

                  <span className="text-sm">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL + CTA */}
      <div className="max-w-4xl mx-auto mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-lg font-medium">
          Total: ₹{total}
        </h2>

        <Link
          to="/checkout"
          className="inline-block bg-black text-white px-6 py-3 text-sm hover:bg-gray-900 transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </section>
  );
}
