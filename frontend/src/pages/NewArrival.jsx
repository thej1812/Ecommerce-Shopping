import { API_URL } from "../utils/api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NewArrival() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products/latest`)
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
    <section className="pt-12 px-6">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-[italiana]">
          New Arrivals
        </h1>
        <p className="text-gray-500 text-sm font-[Mulish]">
          Be the first to shop our latest releases.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500 font-[italiana]">
          Loading new arrivals...
        </p>
      )}

      {/* EMPTY */}
      {!loading && latestProducts.length === 0 && (
        <p className="text-center text-gray-500 font-[italiana]">
          No new products available
        </p>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
        {latestProducts.map(product => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group"
          >
            {/* IMAGE CARD */}
            <div className="relative overflow-hidden bg-gray-100">
              {product.images?.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-44 w-44 md:h-64 md:w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}

      
             
            </div>

            {/* PRODUCT INFO */}
            <div className="mt-4 text-start">
              <h3 className="text-sm text-gray-800 font-[Mulish]">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 font-[Mulish]">
                ₹{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {/* FOOTER */}
  <div className="max-w-6xl mx-auto mt-16 mb-8 md:mb-0 md:mt-24  pt-6 border-t  flex flex-col md:flex-row items-center justify-between gap-6">
    {/* LOGO */}
    <img src="/logo.png" alt="Brand Logo" className="h-12 md:h-14" />

    {/* COPYRIGHT */}
    <p className="text-xs text-gray-500 font-[Mulish] text-center">
      © Copyrights-2025 | Crafted by <a href="https://www.instagram.com/laaz_creative?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="underline">Laaz Creative</a>
    </p>

    {/* SOCIAL ICONS */}
     <div className="flex gap-5">

  <a href="https://youtube.com/@radhi_vedha?si=i9Bew2CEhv519gBH" target="_blank" rel="noopener noreferrer">
    <img src="/youtube.png" alt="YouTube" className="h-5 w-6 cursor-pointer" />
  </a>

  <a href="https://wa.me/919962658353" target="_blank" rel="noopener noreferrer">
    <img src="/whatsapp.png" alt="Whatsapp" className="h-5 w-5 cursor-pointer" />
  </a>

  <a href="https://www.instagram.com/radhi_vedha" target="_blank" rel="noopener noreferrer">
    <img src="/instagram.png" alt="Instagram" className="h-5 w-5 cursor-pointer" />
  </a>

</div>
  </div>
    </section>
  );
}
