import { API_URL } from "../utils/api.js";
import { useEffect, useState } from "react";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!productId) return;

    fetch(`${API_URL}/api/reviews/product/${productId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Reviews fetched:", data);
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
        setReviews([]);
        setLoading(false);
      });
  }, [productId]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="mt-12 py-8">
        <p className="text-center text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 py-8 border-t">
        <h2 className="text-2xl font-[italiana] mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border rounded-lg p-6 bg-white hover:shadow-md transition"
              >
                {/* User Info & Rating */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>

                {/* Review Description */}
                <p className="text-gray-700 mb-4">{review.description}</p>

                {/* Review Image Thumbnail */}
                {review.reviewImage && (
                  <div className="mt-4">
                    <img
                      src={review.reviewImage}
                      alt="Review"
                      onClick={() => openImageModal(review.reviewImage)}
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition border border-gray-200"
                      title="Click to view full image"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Full Image */}
            <img
              src={selectedImage}
              alt="Review Full Size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
