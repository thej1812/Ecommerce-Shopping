import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
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
      {/* HERO SECTION */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to Our Store
        </h1>
        <p className="text-gray-600">
          Discover the latest products added by our team
        </p>
      </section>

      {/* NEW ARRIVALS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            New Arrivals
          </h2>

          <Link
            to="/products"
            className="text-sm text-blue-600"
          >
            View All
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <p className="text-gray-500">
            Loading latest products...
          </p>
        )}

        {/* EMPTY STATE */}
        {!loading && latestProducts.length === 0 && (
          <p className="text-gray-500">
            No products available
          </p>
        )}

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {latestProducts.length > 0 &&
            latestProducts.map(product => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="border p-3 rounded hover:shadow transition"
              >
                {/* IMAGE */}
                {product.images &&
                  product.images.length > 0 && (
                    <img
                      src={`http://localhost:5000/uploads/${product.images[0]}`}
                      alt={product.name}
                      className="h-40 w-full object-cover rounded"
                    />
                  )}

                {/* INFO */}
                <h3 className="font-semibold mt-2">
                  {product.name}
                </h3>

                <p className="text-gray-700">
                  ₹{product.price}
                </p>
              </Link>
            ))}
        </div>
        
      </section>
    </div>
  );
}
