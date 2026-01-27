import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ProductImageSlider from "../components/ProductImageSlider";
import { CartContext } from "../context/CartContext";
import RelatedProducts from "../components/RelatedProducts";

export default function ProductDetail() {
  const { id } = useParams();

  /* 🔴 ALL HOOKS MUST BE AT THE TOP */
  const [product, setProduct] = useState(null);
  const [hasBought, setHasBought] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);
  const { addToCart } = useContext(CartContext);

  /* FETCH PRODUCT */
  useEffect(() => {
    fetch(`https://ecommerce-shopping-k0ip.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  /* CHECK IF USER BOUGHT PRODUCT */
  useEffect(() => {
    if (!product) return;
    if (!localStorage.getItem("token")) return;

    fetch(
      `https://ecommerce-shopping-k0ip.onrender.com/api/orders/has-bought/${product._id}`,
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    )
      .then(res => res.json())
      .then(data => setHasBought(data.hasBought));
  }, [product]);

  if (!product) return <p className="p-10">Loading...</p>;

  const handleAddToCart = () => {
    addToCart(product);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  return (
    <div className="px-4 md:px-10 pt-6 md:pt-8 space-y-12 md:space-y-24 bg-white">

      {/* PRODUCT DETAIL CARD */}
      <div className="max-w-6xl mx-auto border p-6 md:p-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* IMAGE SECTION */}
          <div>
            <ProductImageSlider images={product.images} />
          </div>

          {/* CONTENT SECTION */}
          <div className="flex flex-col justify-center h-full">

            <div className="space-y-4 md:space-y-6">

              <h1 className="text-3xl md:text-5xl font-[Italiana] tracking-wide">
                {product.name}
              </h1>

              <p className="text-xl md:text-2xl">
                ₹{product.price}
              </p>

              <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                {product.description}
              </p>

              {/* ACTION */}
              <div className="space-y-3">
                {product.quantity > 0 ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="bg-black text-white w-full md:w-auto px-10 py-3 text-xs tracking-widest"
                  >
                    ADD TO CART
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 text-white w-full md:w-auto px-10 py-3 text-xs tracking-widest"
                  >
                    SOLD OUT
                  </button>
                )}

                {addedMsg && (
                  <p className="text-xs text-green-600 tracking-wide">
                    {product.name} added to cart
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="max-w-6xl mx-auto space-y-2 px-1 md:px-0">
        <h2 className="text-3xl md:text-4xl font-[Italiana]">
          Related Products
        </h2>
        <p className="text-sm text-gray-500">
          Find what you love, faster and easier.
        </p>

        <RelatedProducts
          category={product.category?._id || product.category}
          productId={product._id}
        />
      </div>

      {/* FOOTER */}
      <div className="max-w-6xl mx-auto mt-12  mb-12 md:mt-16  border-t flex flex-col md:flex-row items-center justify-between gap-6">

        <img src="/logo.png" alt="Brand Logo" className="h-10 md:h-14" />

        <p className="text-xs text-gray-500 font-[Mulish] text-center">
          © Copyrights-2025
        </p>

        <div className="flex gap-5">
          <img src="/youtube.png" alt="YouTube" className="h-5 w-6" />
          <img src="/whatsapp.png" alt="Whatsapp" className="h-5 w-5" />
          <img src="/instagram.png" alt="Instagram" className="h-5 w-5" />
        </div>
      </div>

    </div>
  );
}
