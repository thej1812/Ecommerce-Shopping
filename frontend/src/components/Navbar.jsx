import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // get role from localStorage
  const role = localStorage.getItem("role");

  // fetch categories ONLY for users
  useEffect(() => {
    if (role !== "admin") {
      fetch("http://localhost:5000/api/categories")
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.error(err));
    }
  }, [role]);

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
      {/* COMMON */}
      <Link to="/">Home</Link>

      {/* USER NAVBAR */}
      {role !== "admin" && (
        <>
          <Link to="/products">All Products</Link>

          {/* CATEGORY DROPDOWN (USER ONLY) */}
          <select
            className="border p-1"
            onChange={e => {
              if (e.target.value) {
                navigate(`/products?category=${e.target.value}`);
              }
            }}
          >
            <option value="">Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Link to="/cart">Cart</Link>
         
          <Link to="/my-orders">My Orders</Link>
        </>
      )}

      {/* ADMIN NAVBAR */}
      {role === "admin" && (
        <>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Manage Products</Link>
          <Link to="/admin/categories">Categories</Link>
          <Link to="/admin/orders">Orders</Link>
        </>
      )}

      {/* AUTH LINKS */}
      {!localStorage.getItem("token") ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          style={{ color: "red", cursor: "pointer" }}
        >
          Logout
        </button>
      )}
    </div>
  );
}
