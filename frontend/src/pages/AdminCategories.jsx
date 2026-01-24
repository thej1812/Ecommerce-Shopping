import { useEffect, useState } from "react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const fetchCategories = () => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!name || !image) {
      alert("Name and image required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    await fetch("http://localhost:5000/api/categories/add", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token")
      },
      body: formData
    });

    setName("");
    setImage(null);
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });

    fetchCategories();
  };

  return (
    <div className="px-10 py-10 font-light">

      {/* HEADER */}
      <h1 className="text-2xl tracking-wide mb-10">
        Manage Categories
      </h1>

      {/* ADD CATEGORY */}
      <div className="flex items-center gap-4 mb-14">

        <input
          className="border-b border-black px-1 py-2 text-sm focus:outline-none"
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          className="text-sm"
        />

        <button
          onClick={addCategory}
          className="bg-black text-white px-6 py-2 text-sm"
        >
          Add
        </button>
      </div>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-4 gap-12">
        {categories.map(cat => (
          <div key={cat._id} className="flex flex-col gap-3">

            <img
              src={`http://localhost:5000/uploads/categories/${cat.image}`}
              alt={cat.name}
              className="h-40 w-full object-cover"
            />

            <p className="text-sm tracking-wide">
              {cat.name}
            </p>

            <button
              onClick={() => deleteCategory(cat._id)}
              className="text-xs text-red-600 w-fit"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
