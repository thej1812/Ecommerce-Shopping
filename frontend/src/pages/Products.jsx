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
  
useEffect(() => {
  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  fetchProducts();
  const interval = setInterval(fetchProducts, 3000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {products.map((product) => (
        <div key={product._id} className="border p-4">
        <img className="h-40 mx-auto"
  src={
    product.image
      ? `http://localhost:5000/uploads/${product.image}`
      : ""
  }
/>


          <h2 className="font-bold">{product.name}</h2>
          <p>{product.description}</p>
          <p>₹{product.price}</p>
         {product.quantity > 0 ? (
  <button
    onClick={() => addToCart(product)}
    className="bg-black text-white px-4 py-2"
  >
    Add to Cart
  </button>
) : (
  <button
    disabled
    className="bg-gray-400 text-white px-4 py-2 cursor-not-allowed"
  >
    Sold Out
  </button>
)}

        </div>
      ))}
    </div>
  );
}
