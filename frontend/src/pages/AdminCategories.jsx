import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminCategories() {
   const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
    };
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  // UI ONLY – delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

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

  const confirmDelete = async () => {
    await fetch(
      `http://localhost:5000/api/categories/${deleteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    setDeleteId(null);
    setDeleteName("");
    fetchCategories();
  };

  return (
    <section>
      {/* TOP ADMIN NAV */}
      <div className=" sticky top-0 bg-white w-full border-b border-black px-10 py-4 flex items-center justify-between font-light ">
        {/* LOGO */}
         <Link to="/admin">
          <img src="/logo.png" alt="logo" className="h-14" />
        </Link>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    <section className="py-8 px-10 font-[Mulish]">
      {/* HEADER */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl  font-[italiana]">
          Manage Categories
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Add or remove product categories
        </p>
      </div>

      {/* ADD CATEGORY CARD */}
      <div className="max-w-xl mx-auto mb-16 border  p-6 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm"
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
            className="bg-black text-white px-6 py-2 text-sm hover:bg-gray-900 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="group border p-6  overflow-hidden bg-white hover:shadow-md transition"
          >
            <img
              src={`http://localhost:5000/uploads/categories/${cat.image}`}
              alt={cat.name}
              className="h-40 w-full object-cover"
            />

            <div className="pt-12 flex justify-between items-center">
              <p className="text-sm tracking-wide">
                {cat.name}
              </p>

              <button
                onClick={() => {
                  setDeleteId(cat._id);
                  setDeleteName(cat.name);
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔴 DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-medium mb-2">
              Delete Category
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium">{deleteName}</span>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteId(null);
                  setDeleteName("");
                }}
                className="px-4 py-2 border text-sm"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
    </section>
  );
}
