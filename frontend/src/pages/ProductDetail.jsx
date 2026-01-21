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
  const { addToCart } = useContext(CartContext);

  /* FETCH PRODUCT */
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  /* CHECK IF USER BOUGHT PRODUCT */
  useEffect(() => {
    if (!product) return;
    if (!localStorage.getItem("token")) return;

    fetch(
      `http://localhost:5000/api/orders/has-bought/${product._id}`,
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    )
      .then(res => res.json())
      .then(data => setHasBought(data.hasBought));
  }, [product]);

  /* 🔴 RETURNS AFTER ALL HOOKS */
  if (!product) return <p className="p-10">Loading...</p>;

  return (
    <div className="px-10 py-12 space-y-16">

      {/* PRODUCT CARD */}
      <div className="grid md:grid-cols-2 gap-14 shadow-sm p-10">

        {/* IMAGE SECTION */}
        <ProductImageSlider images={product.images} />

        {/* DETAILS SECTION */}
        <div className="flex flex-col justify-between">

          <div className="space-y-5">
            <h1 className="text-2xl tracking-wide">
              {product.name}
            </h1>

            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>

            <p className="text-xl">
              ₹{product.price}
            </p>

            <p className="text-sm text-gray-600">
              Stock: {product.quantity}
            </p>
          </div>

          {/* ACTION */}
          <div className="mt-8">
            {product.quantity > 0 ? (
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="bg-black-400 text-white px-8 py-3 text-sm"
              >
                Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white px-8 py-3 text-sm"
              >
                Sold Out
              </button>
            )}
          </div>

        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      <div>
        <RelatedProducts
          category={product.category?._id || product.category}
          productId={product._id}
        />
      </div>

    </div>
  );
}
