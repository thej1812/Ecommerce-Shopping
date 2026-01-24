import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const [categories, setCategories] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/categories")
    .then(res => res.json())
    .then(data => setCategories(data));
}, []);

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
  {/* BRAND HERO UI */}
<section className="w-full">
  <div
    className="relative h-[55vh] md:h-[90vh] lg:h-[800px]
    overflow-hidden flex items-end justify-center
    border-b border-black"
  >

    {/* BACKGROUND IMAGE */}
    <img
      src="/hero-bg.png"
      alt="Background"
      className="
        absolute
        w-[600px] h-[500px]
        md:w-[450px] md:h-[450px]
        lg:w-[600px] lg:h-[600px]
        
        md:right-[120px]
        lg:right-[340px]
        object-contain
        opacity-80
        z-0
      "
    />

    {/* BRAND TITLE */}
    <h1
      className="
        absolute
        top-6
        left-1/2 -translate-x-1/2
        lg:left-auto lg:right-10 lg:translate-x-0
        text-[42px]
        md:text-7xl
        lg:text-[180px]
        font-light
        font-[italiana]
        tracking-widest
        text-black
        z-30
        whitespace-nowrap
      "
    >
      RADIVEDHA
    </h1>

    {/* LEFT SIDE IMAGES – DESKTOP ONLY */}
    <div className="absolute left-10 top-1/3 hidden lg:flex flex-col gap-10 z-40">
      <img src="/bracelet.png" alt="" className="w-44 object-contain" />
      <img src="/bouquet.png" alt="" className="w-48 object-contain" />
    </div>

    {/* RIGHT SIDE IMAGES – DESKTOP ONLY */}
    <div className="absolute right-10 top-1/3 hidden lg:flex flex-col gap-10 z-40">
      <img src="/scrunchies.png" alt="" className="w-64 object-contain" />
      <img src="/necklace.png" alt="" className="w-48 object-contain" />
    </div>

    {/* CENTER IMAGE */}
    <img
      src="/hero-center.png"
      alt="Center Hero"
      className="
        relative
        h-[44vh]
        md:h-[75vh]
        lg:h-[100vh]
        object-contain
        z-20
      "
    />

  </div>
</section>

<section className="w-full py-20">
  {/* TITLE */}
  <div className="text-center mb-14">
    <h2 className="text-4xl font-[italiana] mb-2 ">Categories</h2>
    <p className="text-gray-500 text-sm font-[Mulish]">
      Explore your favorite brands in one place
    </p>
  </div>

  {/* HORIZONTAL SCROLL */}
  <div
    className="
      flex gap-10
      overflow-x-auto
      px-6
      scrollbar-hide
      snap-x snap-mandatory
    "
  >
    {categories.map(cat => (
      <div
        key={cat._id}
        onClick={() =>
          window.location.href = `/products?category=${cat._id}`
        }
        className="
          relative
          min-w-[260px]
          h-[260px]
          cursor-pointer
          overflow-hidden
          group
          snap-center
        "
      >
        {cat.image && (
          <img
            src={`http://localhost:5000/uploads/categories/${cat.image}`}
            alt={cat.name}
            className="
              w-full h-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        )}

        {/* OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-black/30
            flex items-center justify-center
            transition
            duration-300
            group-hover:bg-black/50
          "
        >
          <p className="text-white text-lg font-light tracking-wide text-center">
            {cat.name}
          </p>
        </div>
      </div>
    ))}
  </div>
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
