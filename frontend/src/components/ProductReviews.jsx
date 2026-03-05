import { API_URL } from "../utils/api.js";
import { useEffect, useState } from "react";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/reviews/${productId}`)
      .then(res => res.json())
      .then(data => setReviews(data));
  }, [productId]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">
        Customer Reviews
      </h2>

      {reviews.map(r => (
        <div key={r._id} className="border p-4 mb-4">
          <p className="font-semibold">
            {r.user.name} – ⭐ {r.rating}/5
          </p>

          <p className="mt-1">{r.comment}</p>

          <div className="flex gap-2 mt-2">
            {r.images.map(img => (
              <img
                key={img}
                src={img}
                className="w-20 h-20 object-cover"
              />
            ))}
          </div>

          {r.video && (
            <video
              controls
              className="w-64 mt-2"
              src={r.video}
            />
          )}
        </div>
      ))}
    </div>
  );
}
