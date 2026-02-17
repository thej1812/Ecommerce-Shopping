import { API_URL } from "../utils/api.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminProducts() {
   const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
    };
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [updatedId, setUpdatedId] = useState(null);

  // 🔹 DELETE MODAL STATE (UI ONLY)
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        const q = {};
        data.forEach(p => (q[p._id] = p.quantity));
        setQuantities(q);
      });
  };

  // UPDATE QUANTITY
  const updateQuantity = async (id) => {
    await fetch(
      `${API_URL}/api/products/${id}/quantity`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({ quantity: quantities[id] })
      }
    );

    setUpdatedId(id);
    setTimeout(() => setUpdatedId(null), 2000);
    fetchProducts();
  };

  // CONFIRM DELETE
  const confirmDelete = async () => {
    await fetch(
      `${API_URL}/api/products/${deleteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    setProducts(prev => prev.filter(p => p._id !== deleteId));
    setDeleteId(null);
    setDeleteName("");
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

    <section className="py-8 px-6 font-[Mulish]">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-[italiana]">
          Manage Products
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update stock or remove products from store
        </p>
      </div>

      {/* PRODUCT LIST */}
      <div className="max-w-5xl mx-auto space-y-6">
        {products.map(product => (
          <div
            key={product._id}
            className="border p-6 bg-white hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
              
              {/* PRODUCT INFO */}
              <div className="flex gap-4 items-center">
                {product.images?.length > 0 && (
                  <img
                    src={`${API_URL}/uploads/${product.images[0]}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}

                <div>
                  <p className="text-sm font-medium">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ₹{product.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.quantity}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-3 sm:items-end">
                {updatedId === product._id && (
                  <p className="text-sm text-green-600">
                    {product.name} updated successfully
                  </p>
                )}

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    value={quantities[product._id]}
                    onChange={e =>
                      setQuantities({
                        ...quantities,
                        [product._id]: Number(e.target.value)
                      })
                    }
                    className="border px-2 py-1 w-24 text-sm"
                  />

                  <button
                    onClick={() => updateQuantity(product._id)}
                    className="bg-black text-white px-4 py-1 text-sm"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => {
                      setDeleteId(product._id);
                      setDeleteName(product.name);
                    }}
                    className="bg-red-600 text-white px-4 py-1 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔴 DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-medium mb-2">
              Delete Product
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
