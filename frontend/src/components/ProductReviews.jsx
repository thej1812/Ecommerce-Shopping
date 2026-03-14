
import { API_URL } from "../utils/api.js";
import { useEffect, useState } from "react";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!productId) return;

    fetch(`${API_URL}/api/reviews/product/${productId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Reviews fetched:", data);
        setReviews(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
        setReviews([]);
        setIsLoading(false);
      });
  }, [productId]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1,2,3,4,5].map((star)=>(
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
    return date.toLocaleDateString("en-US",{
      year:"numeric",
      month:"long",
      day:"numeric"
    });
  };

  const openImageModal = (imageUrl)=>{
    setSelectedImage(imageUrl);
  };

  const closeImageModal = ()=>{
    setSelectedImage(null);
  };

  if(isLoading){
    return(
      <div className="mt-12 py-8">
        <p className="text-center text-gray-500">Loading reviews...</p>
      </div>
    )
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0,3);

  const reviewImages = reviews
    .filter(r => r.reviewImage)
    .map(r => r.reviewImage);

  return(
    <>
      <div className="mt-12 py-8 border-t">

        <h2 className="text-2xl font-[italiana] mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        {/* PINTEREST STYLE MASONRY GRID */}
        {reviewImages.length > 0 && (
          <div className="columns-2 md:columns-4 gap-4 space-y-4 mb-10">
            {reviewImages.map((img,index)=>(
              <img
                key={index}
                src={img}
                alt="Review"
                onClick={()=>openImageModal(img)}
                className="w-full rounded-lg cursor-pointer hover:opacity-90 transition break-inside-avoid"
              />
            ))}
          </div>
        )}

        {reviews.length === 0 ?(
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ):(
          <>
            {/* REVIEWS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {displayedReviews.map((review)=>(
                <div
                  key={review._id}
                  className="border  p-6 bg-white "
                >

                  <div className="flex items-start justify-between mb-3">

                    <div>
                      <p className="font-[Mulish] text-xl text-gray-800">
                        {review.user?.name || "Anonymous"}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm font-[Mulish] text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>

                  </div>

                  <p className="text-gray-700">
                    {review.description}
                  </p>

                </div>
              ))}

            </div>

            {/* VIEW ALL REVIEWS */}
            {reviews.length > 3 && !showAllReviews && (
              <div className="text-center mt-8">
                <button
                  onClick={()=>setShowAllReviews(true)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  View All Reviews
                </button>
              </div>
            )}

          </>
        )}

      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh]">

            <button
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition"
            >
              ✕
            </button>

            <img
              src={selectedImage}
              alt="Review Full"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e)=>e.stopPropagation()}
            />

          </div>
        </div>
      )}

    </>
  )
}
