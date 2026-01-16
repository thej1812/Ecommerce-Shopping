import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {products.map((product) => (
        <div key={product._id} className="border p-4">
          <img
            src={`http://localhost:5000/uploads/${product.image}`}
            className="h-40 mx-auto"
          />

          <h2 className="font-bold">{product.name}</h2>
          <p>{product.description}</p>
          <p>₹{product.price}</p>

          {/* ✅ THIS IS THE IMPORTANT FIX */}
          <button
            onClick={() => addToCart(product)}
            className="bg-black text-white px-4 py-2 mt-2"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
