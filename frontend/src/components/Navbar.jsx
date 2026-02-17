import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiShoppingBag, FiUser } from "react-icons/fi";
import { API_URL } from "../utils/api.js";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);       // mobile menu
  const [catOpen, setCatOpen] = useState(false); // desktop dropdown
  const [sticky, setSticky] = useState(false);

  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  /* FETCH */
  useEffect(() => {
    if (role !== "admin") {
      fetch(`${API_URL}/api/categories`)
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(console.error);
    }
  }, [role]);

  /* STICKY */
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* MOBILE MENU GSAP */
  useEffect(() => {
    if (open) {
      gsap.to(menuRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
      });
    } else {
      gsap.to(menuRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
      });
    }
  }, [open]);

  /* DESKTOP DROPDOWN GSAP */
  useEffect(() => {
    if (!dropdownMenuRef.current) return;

    if (catOpen) {
      gsap.fromTo(
        dropdownMenuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [catOpen]);

  /* CLICK OUTSIDE DROPDOWN */
  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav
  className=" sticky top-0 w-full bg-white px-6 md:px-12 py-4 z-50 transition-all
  border-b border-black"
>

      {/* BACKDROP */}
      <div
        ref={overlayRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm opacity-0 pointer-events-none z-40"
      />

      {/* TOP BAR */}
      <div className="flex items-center justify-between relative z-50">

        {/* MOBILE HAMBURGER */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          {open ? "✕" : "☰"}
        </button>

        {/* LOGO */}
        <Link to="/">
          <img src="/logo.png" alt="logo" className="h-14" />
        </Link>

        {/* DESKTOP MENU */}
        {role !== "admin" && (
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-12 text-sm">

            <Link to="/products">All Product</Link>

            {/* GSAP DROPDOWN */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1"
              >
                Categories
                <span className={`text-xs transition-transform ${catOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {catOpen && (
                <div
                  ref={dropdownMenuRef}
                  className="absolute top-full left-0 mt-4 w-48 bg-white shadow-sm  overflow-hidden"
                >
                  {categories.map(cat => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        navigate(`/products?category=${cat._id}`);
                        setCatOpen(false);
                      }}
                      className="block w-full text-left px-5 py-3 text-sm hover:bg-gray-100"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/new-arrivals">New Arrivals</Link>
            <Link to="/my-orders">My Order</Link>
          </div>
        )}

        {/* RIGHT ICONS */}
        <div className="hidden md:flex items-center gap-6 text-lg">
          <Link to="/cart"><FiShoppingBag /></Link>
          {!localStorage.getItem("token") ? (
            <Link to="/login"><FiUser /></Link>
          ) : (
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="text-sm text-red-500 "
            >
              Logout
            </button>
          )}
        </div>

      </div>

      {/* MOBILE MENU */}
      <div
        ref={menuRef}
        className="md:hidden absolute top-full left-0 w-full bg-white opacity-0 -translate-y-5 z-50"
      >
        <div className="flex flex-col items-center gap-6 py-8 text-sm">
          <Link to="/products" onClick={() => setOpen(false)}>All Product</Link>

          <select
            onChange={e => {
              navigate(`/products?category=${e.target.value}`);
              setOpen(false);
            }}
            className="px-4 py-2 "
          >
            <option value="">Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <Link to="/new-arrivals" onClick={() => setOpen(false)}>New Arrivals</Link>
          <Link to="/my-orders" onClick={() => setOpen(false)}>My Order</Link>
           <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
          <Link className="bg-black text-white pt-2 pb-2 pl-8 pr-8 " to="/login" onClick={() => setOpen(false)}>Login</Link>
        </div>
      </div>
    </nav>
  );
}
