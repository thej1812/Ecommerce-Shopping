import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RelatedProducts({ category, productId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;

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
    <div className="pt-4 md:pt-6 pb-4 md:pb-6">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {products.map(p => (
          <Link
            to={`/product/${p._id}`}
            key={p._id}
            className=" p-3 md:p-6 block"
          >
            {p.images && p.images.length > 0 && (
              <img
                src={`http://localhost:5000/uploads/${p.images[0]}`}
                className="h-44 w-44 md:h-64 md:w-full object-cover transition-transform duration-300 group-hover:scale-105"
                alt={p.name}
              />
            )}

            <p className="text-sm mt-4 text-gray-800 font-[Mulish]">
              {p.name}
            </p>

            <p className="text-sm text-gray-500 mt-1 font-[Mulish]">
              ₹{p.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
