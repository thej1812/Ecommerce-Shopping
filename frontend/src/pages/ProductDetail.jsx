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
  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      {/* IMAGE GALLERY */}
      <ProductImageSlider images={product.images} />

      {/* PRODUCT DETAILS */}
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <p className="mt-4 text-gray-700 leading-relaxed">
          {product.description}
        </p>

        <p className="text-xl my-2">₹{product.price}</p>

        <p className="text-sm text-gray-600">
          Stock: {product.quantity}
        </p>

        <p className="mt-4">{product.description}</p>

        {product.quantity > 0 ? (
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="bg-black text-white px-6 py-2 mt-4"
          >
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-400 text-white px-6 py-2 mt-4"
          >
            Sold Out
          </button>
        )}
      </div>

      <RelatedProducts
        category={product.category?._id || product.category}
        productId={product._id}
      />

      
    </div>
  );
}
