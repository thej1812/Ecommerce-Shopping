import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RelatedProducts({ category, productId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return; // 🔴 IMPORTANT GUARD

    fetch(
      `http://localhost:5000/api/products?category=${category}&exclude=${productId}`
    )
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]));
  }, [category, productId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Related Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => (
          <Link
            to={`/product/${p._id}`}
            key={p._id}
            className="border p-2"
          >
            {p.images && p.images.length > 0 && (
              <img
                src={`http://localhost:5000/uploads/${p.images[0]}`}
                className="w-full h-40 object-cover"
                alt={p.name}
              />
            )}
            <p className="mt-2 font-semibold">{p.name}</p>
            <p>₹{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
