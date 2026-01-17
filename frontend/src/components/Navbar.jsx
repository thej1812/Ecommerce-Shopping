import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
   const [categories, setCategories] = useState([]);
   const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Link to="/">Home</Link>
      <Link to="/products">All Products</Link>

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
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      <Link to="/my-orders">My Orders</Link>

    </div>
  );
}
