import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api.js";
import axios from "axios";

export default function AddReview() {
  const { productId, orderId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(true);

  useEffect(() => {
    // Fetch product details
    fetch(`${API_URL}/api/products/${productId}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));

    // Check if user can review
    fetch(`${API_URL}/api/reviews/can-review/${productId}/${orderId}`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.canReview) {
          alert(data.reason || "You cannot review this product");
          navigate("/my-orders");
        }
      })
      .catch(err => console.error(err));
  }, [productId, orderId, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!description.trim()) {
      alert("Please write a review");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("description", description);
      if (reviewImage) {
        formData.append("reviewImage", reviewImage);
      }

      await axios.post(
        `${API_URL}/api/reviews/${productId}/${orderId}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      alert("Review submitted successfully!");
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-[Mulish]">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-[italiana] text-center mb-2">
          Write a Review
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Share your experience with this product
        </p>

        {/* Product Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-8">
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-20 object-cover rounded"
            />
          )}
          <div>
            <h3 className="font-medium text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500">₹{product.price}</p>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-colors"
                >
                  {star <= (hoverRating || rating) ? (
                    <span className="text-yellow-400">★</span>
                  ) : (
                    <span className="text-gray-300">★</span>
                  )}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Review Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your experience with this product..."
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-xs h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/my-orders")}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
