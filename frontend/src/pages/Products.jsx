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

    let url = "https://ecommerce-shopping-k0ip.onrender.com/api/products";
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
    <div className="px-4 md:px-10 py-8 md:py-12 bg-white font-[Mulish] ">
<div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-[italiana]">
         Our Complete Collection
        </h1>
        <p className="text-gray-500 text-[12px] md:text-sm font-[Mulish]">
          Browse everything available in our store, carefully selected for you.
        </p>
      </div>
      {products.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No products found
        </p>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 ">

        {products.map(product => (
          <div
            key={product._id}
            className="flex flex-col gap-3 md:gap-4 p-4"
          >

            {/* IMAGE + INFO */}
            <Link to={`/product/${product._id}`} className="block">

              {product.images?.length > 0 && (
                <img
                  src={`https://ecommerce-shopping-k0ip.onrender.com/uploads/${product.images[0]}`}
                  alt={product.name}
                  className="
                    h-44 w-44 md:h-64 md:w-full object-cover transition-transform duration-300 group-hover:scale-105
                   
                  "
                />
              )}

              <h2 className="text-sm  text-gray-800 font-[Mulish] mt-4">
                {product.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1 font-[Mulish]">
                From ₹{product.price}
              </p>
            </Link>

            {/* ACTION */}
            {product.quantity > 0 ? (
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="
                  bg-black text-white
                  px-4 py-2
                  text-xs tracking-widest
                  w-full md:w-fit
                "
              >
                ADD TO CART
              </button>
            ) : (
              <button
                disabled
                className="
                  bg-gray-400 text-white
                  px-4 py-2
                  text-xs tracking-widest
                  w-full md:w-fit
                  cursor-not-allowed
                "
              >
                SOLD OUT
              </button>
            )}
          </div>
        ))}

      </div>
       {/* FOOTER */}
  <div className="max-w-6xl mx-auto mt-16 mb-8 md:mb-0 md:mt-24  pt-6 border-t  flex flex-col md:flex-row items-center justify-between gap-6">
    {/* LOGO */}
    <img src="/logo.png" alt="Brand Logo" className="h-12 md:h-14" />

    {/* COPYRIGHT */}
    <p className="text-xs text-gray-500 font-[Mulish] text-center">
      © Copyrights-2025
    </p>

    {/* SOCIAL ICONS */}
    <div className="flex gap-5">
      <img src="/youtube.png" alt="YouTube" className="h-5 w-6" />
      <img src="/whatsapp.png" alt="Whatsapp" className="h-5 w-5" />
      <img src="/instagram.png" alt="Instagram" className="h-5 w-5" />
    </div>
  </div>
    </div>
    
  );
}
