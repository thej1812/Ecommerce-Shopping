import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminProductImages() {
  const { id } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setImages(data.images));
  }, [id]);

  const saveImages = async (newImages) => {
    setImages(newImages);

    await fetch(
      `http://localhost:5000/api/products/${id}/images`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({ images: newImages })
      }
    );
  };

  const deleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    saveImages(newImages);
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    const target = index + direction;

    if (target < 0 || target >= images.length) return;

    [newImages[index], newImages[target]] =
      [newImages[target], newImages[index]];

    saveImages(newImages);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Manage Product Images
      </h1>

      {images.map((img, index) => (
        <div
          key={img}
          className="flex items-center gap-4 mb-4"
        >
          <img
            src={`http://localhost:5000/uploads/${img}`}
            className="w-24 h-24 object-cover"
          />

          <button onClick={() => moveImage(index, -1)}>
            ↑
          </button>
          <button onClick={() => moveImage(index, 1)}>
            ↓
          </button>

          <button
            className="text-red-600"
            onClick={() => deleteImage(index)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
