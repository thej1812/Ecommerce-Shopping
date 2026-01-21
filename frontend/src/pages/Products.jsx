import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useLocation } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("category");

    let url = "http://localhost:5000/api/products";
    if (categoryId) url += `?category=${categoryId}`;

    const fetchProducts = () => {
      fetch(url)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(console.error);
    };

    fetchProducts();
    const interval = setInterval(fetchProducts, 3000);
    return () => clearInterval(interval);
  }, [location.search]);

  return (
    <div className="px-6 py-10">
      {products.length === 0 && (
        <p className="text-center">No products found</p>
      )}

      {/* ALWAYS 4 COLUMNS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.map(product => (
          <div key={product._id} className="flex flex-col gap-3">

            {/* IMAGE + INFO */}
            <Link to={`/product/${product._id}`} className="block">
              {product.images?.length > 0 && (
                <img
                  src={`http://localhost:5000/uploads/${product.images[0]}`}
                  alt={product.name}
                  className=" w-full h-[160px] md:w-[260px] md:h-[260px] object-contain"
                />
              )}

              <h2 className="mt-3 text-sm tracking-wide">
                {product.name}
              </h2>

              <p className="text-xs text-gray-600">
                From ₹{product.price}
              </p>
            </Link>

            {/* ACTION */}
            {product.quantity > 0 ? (
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="bg-black text-white px-4 py-2 text-xs w-fit"
              >
                Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 text-xs w-fit cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
