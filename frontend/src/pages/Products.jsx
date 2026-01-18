import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import ProductImageSlider from "../components/ProductImageSlider";
import { Link, useLocation } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("category");

    let url = "http://localhost:5000/api/products";

    if (categoryId) {
      url += `?category=${categoryId}`;
    }

    const fetchProducts = () => {
      fetch(url)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error(err));
    };

    fetchProducts(); // initial load

    // optional polling (live stock update)
    const interval = setInterval(fetchProducts, 3000);

    return () => clearInterval(interval);
  }, [location.search]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
      {products.length === 0 && (
        <p className="text-center col-span-full">
          No products found
        </p>
      )}

      {products.map(product => (
        <div
          key={product._id}
          className="border p-3 rounded shadow-sm"
        >
          {/* 🔹 CLICKABLE PRODUCT (DETAIL PAGE) */}
          <Link to={`/product/${product._id}`}>
  {product.images && product.images.length > 0 && (
    <img
      src={`http://localhost:5000/uploads/${product.images[0]}`}
      alt={product.name}
      className="w-full h-48 object-cover rounded"
    />
  )}

  <h2 className="font-bold mt-2">
    {product.name}
  </h2>

  <p className="text-gray-700">
    ₹{product.price}
  </p>

  <p className="text-sm text-gray-500 mt-1">
    Stock: {product.quantity}
  </p>
</Link>


          {/* 🔹 ACTION BUTTON (MUST NOT BE INSIDE LINK) */}
          {product.quantity > 0 ? (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="bg-black text-white px-4 py-2 mt-3 w-full"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white px-4 py-2 mt-3 w-full cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
