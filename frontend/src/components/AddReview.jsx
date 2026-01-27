import { useState } from "react";

export default function AddReview({ productId, onAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const submit = async () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);

    for (let img of images) {
      formData.append("images", img);
    }

    if (video) {
      formData.append("video", video);
    }

    await fetch(
      `https://ecommerce-shopping-k0ip.onrender.com/api/reviews/${productId}`,
      {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token")
        },
        body: formData
      }
    );

    onAdded();
    alert("Review submitted");
  };

  return (
    <div className="border p-4 mt-6">
      <h3 className="font-semibold mb-2">
        Write a Review
      </h3>

      <select
        value={rating}
        onChange={e => setRating(e.target.value)}
        className="border p-2 mb-2"
      >
        {[5,4,3,2,1].map(n => (
          <option key={n} value={n}>
            {n} Star
          </option>
        ))}
      </select>

      <textarea
        placeholder="Your comment"
        className="border p-2 w-full mb-2"
        onChange={e => setComment(e.target.value)}
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={e => setImages(e.target.files)}
      />

      <input
        type="file"
        accept="video/*"
        onChange={e => setVideo(e.target.files[0])}
        className="mt-2"
      />

      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2 mt-3"
      >
        Submit Review
      </button>
    </div>
  );
}
