import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
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

<section className="w-full pt-20">
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
      flex gap-8 md:gap-10
      overflow-x-auto
      px-4
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
          min-w-[60px]
          h-[60px]
          md:min-w-[260px]
          md:h-[260px]
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
          <p className="text-white text-sm md:text-lg  font-light tracking-wide text-center">
            {cat.name}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>

{/* NEW ARRIVALS */}
<section className="pt-20">
  {/* HEADER */}
  <div className="text-center mb-12">
    <h2 className="text-4xl  font-[italiana]">
      New Arrivals
    </h2>
    <p className="text-gray-500 text-sm font-[Mulish]">
      Find what you love, faster and easier.
    </p>
  </div>

  {/* LOADING STATE */}
  {loading && (
    <p className="text-center text-gray-500 font-[italiana]">
      Loading latest products...
    </p>
  )}

  {/* EMPTY STATE */}
  {!loading && latestProducts.length === 0 && (
    <p className="text-center font-[italiana] text-gray-500">
      No products available
    </p>
  )}

  {/* PRODUCT GRID */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-10">
    {latestProducts.length > 0 &&
      latestProducts.map(product => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="group"
        >
          {/* IMAGE */}
          <div className="relative overflow-hidden">
            {product.images && product.images.length > 0 && (
              <img
                src={`http://localhost:5000/uploads/${product.images[0]}`}
                alt={product.name}
                className="h-44 w-44 md:h-64 md:w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

           
          </div>

          {/* PRODUCT INFO */}
          <div className="mt-4">
            <h3 className="text-sm  text-gray-800 font-[Mulish]">
              {product.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1 font-[Mulish]">
              ₹{product.price}
            </p>
          </div>
        </Link>
      ))}
  </div>
</section>
{/* ABOUT PRODUCTS */}
<section className="py-20">
  {/* HEADER */}
  <div className="text-center mb-14">
    <h2 className="text-4xl font-serif font-medium">
      About Products
    </h2>
    <p className="text-sm text-gray-500 mt-2">
      Every product, chosen with care.
    </p>
  </div>

  <div className="max-w-6xl mx-auto border border-gray-300">
    {/* ITEM 1 */}
    <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-300">
      {/* IMAGE */}
      <div className="flex items-center justify-center p-10">
        <img
          src="/images/scrunchies.png"
          alt="Scrunchies"
          className="max-h-48 object-contain"
        />
      </div>

      {/* CONTENT */}
      <div className="p-10 flex flex-col justify-center">
        <h3 className="text-2xl font-serif mb-4">
          Our Scrunchies
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Crafted with care and attention to detail, our scrunchies
          combine comfort and elegance. Made from premium fabrics,
          they protect your hair while adding a stylish finishing
          touch to any look.
        </p>

        <button className="flex items-center gap-2 border border-gray-800 px-5 py-2 text-sm w-fit hover:bg-gray-800 hover:text-white transition">
          SHOP NOW
          <img
            src="/icons/arrow-right.svg"
            alt="arrow"
            className="w-4 h-4"
          />
        </button>
      </div>
    </div>

    {/* ITEM 2 */}
    <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-300">
      {/* CONTENT */}
      <div className="p-10 flex flex-col justify-center">
        <h3 className="text-2xl font-serif mb-4">
          Our Bracelets
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Our bracelets are crafted with high-quality imitation pearls,
          refined metal alloys, and sparkling simulated diamonds —
          designed to look elegant, feel comfortable, and shine
          beautifully for everyday wear and special occasions.
        </p>

        <button className="flex items-center gap-2 border border-gray-800 px-5 py-2 text-sm w-fit hover:bg-gray-800 hover:text-white transition">
          SHOP NOW
          <img
            src="/icons/arrow-right.svg"
            alt="arrow"
            className="w-4 h-4"
          />
        </button>
      </div>

      {/* IMAGE */}
      <div className="flex items-center justify-center p-10">
        <img
          src="/images/bracelets.png"
          alt="Bracelets"
          className="max-h-48 object-contain"
        />
      </div>
    </div>

    {/* ITEM 3 */}
    <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-300">
      {/* IMAGE */}
      <div className="flex items-center justify-center p-10">
        <img
          src="/images/bouquet.png"
          alt="Bouquet"
          className="max-h-48 object-contain"
        />
      </div>

      {/* CONTENT */}
      <div className="p-10 flex flex-col justify-center">
        <h3 className="text-2xl font-serif mb-4">
          Our Bouquet
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Our bouquet is thoughtfully handcrafted with meaningful
          notes, a blend of real and artificial flowers, and finished
          with premium wrapping — designed to create a lasting and
          memorable expression for your loved one.
        </p>

        <button className="flex items-center gap-2 border border-gray-800 px-5 py-2 text-sm w-fit hover:bg-gray-800 hover:text-white transition">
          SHOP NOW
          <img
            src="/icons/arrow-right.svg"
            alt="arrow"
            className="w-4 h-4"
          />
        </button>
      </div>
    </div>

    {/* ITEM 4 */}
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* CONTENT */}
      <div className="p-10 flex flex-col justify-center">
        <h3 className="text-2xl font-serif mb-4">
          Our Earrings & Jewelry
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Our earrings and jewelry are thoughtfully designed to blend
          elegance with everyday comfort. Crafted using refined
          finishes, each piece adds a timeless touch to both daily
          wear and special occasions.
        </p>

        <button className="flex items-center gap-2 border border-gray-800 px-5 py-2 text-sm w-fit hover:bg-gray-800 hover:text-white transition">
          SHOP NOW
          <img
            src="/icons/arrow-right.svg"
            alt="arrow"
            className="w-4 h-4"
          />
        </button>
      </div>

      {/* IMAGE */}
      <div className="flex items-center justify-center p-10">
        <img
          src="/images/earrings.png"
          alt="Earrings"
          className="max-h-48 object-contain"
        />
      </div>
    </div>
  </div>
</section>


      

    </div>
  );
}
