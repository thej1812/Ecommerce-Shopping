import { useEffect, useState } from "react";

export default function AdminCategories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!name.trim()) return;

    await fetch("http://localhost:5000/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({ name })
    });

    setName("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this category?"
    );
    if (!confirmDelete) return;

    await fetch(
      `http://localhost:5000/api/categories/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    fetchCategories();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Manage Categories
      </h1>

      <input
        placeholder="New Category"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 mr-2"
      />

      <button
        onClick={addCategory}
        className="bg-black text-white px-4 py-2"
      >
        Add
      </button>

      <ul className="mt-4">
        {categories.map(cat => (
          <li
            key={cat._id}
            className="flex justify-between items-center border p-2 mb-2"
          >
            <span>{cat.name}</span>
            <button
              onClick={() => deleteCategory(cat._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
