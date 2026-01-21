import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NewArrival() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/latest")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch latest products");
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLatestProducts(data);
        } else {
          setLatestProducts([]);
        }
      })
      .catch(err => {
        console.error(err);
        setLatestProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      {/* PAGE TITLE */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          New Arrivals
        </h1>
        <p className="text-gray-600">
          Explore all the latest products added to our store
        </p>
      </section>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">
          Loading new arrivals...
        </p>
      )}

      {/* EMPTY */}
      {!loading && latestProducts.length === 0 && (
        <p className="text-gray-500">
          No new products available
        </p>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {latestProducts.map(product => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="rounded-lg p-3 hover:shadow-lg transition bg-white"
          >
            {/* IMAGE */}
            {product.images?.length > 0 && (
              <img
                src={`http://localhost:5000/uploads/${product.images[0]}`}
                alt={product.name}
                className="h-44 w-full object-cover rounded"
              />
            )}

            {/* INFO */}
            <h3 className="mt-3 font-medium">
              {product.name}
            </h3>
            <p className="text-gray-700">
              ₹{product.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
