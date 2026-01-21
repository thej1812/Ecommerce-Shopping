// src/pages/AdminDashboard.jsx
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* TOP ADMIN NAV */}
      <div className="w-full border-b border-black px-10 py-4 flex items-center justify-between font-light">
        {/* LOGO */}
         <Link to="/admin">
          <img src="./logo.png" alt="logo" className="h-14" />
        </Link>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-10 py-10 ">
        <h1 className="text-2xl tracking-wide mb-10">
          Admin Dashboard
        </h1>

        <div className="flex flex-col gap-5">

          <a
            href="/admin/add-product"
            className="
              border border-black
              px-6 py-3
              text-sm
              w-fit
              hover:bg-black hover:text-white
              transition
            "
          >
            Add Product
          </a>

          <a
            href="/admin/orders"
            className="
              border border-black
              px-6 py-3
              text-sm
              w-fit
              hover:bg-black hover:text-white
              transition
            "
          >
            View Orders
          </a>

          <a
            href="/admin/products"
            className="
              border border-black
              px-6 py-3
              text-sm
              w-fit
              hover:bg-black hover:text-white
              transition
            "
          >
            Manage Products
          </a>

          <a
            href="/admin/categories"
            className="
              border border-black
              px-6 py-3
              text-sm
              w-fit
              hover:bg-black hover:text-white
              transition
            "
          >
            Manage Categories
          </a>

        </div>
      </div>
    </>
  );
}
