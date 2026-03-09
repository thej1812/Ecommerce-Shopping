import "./App.css";

// Components
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

// Pages - Public
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Pages - Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import MyOrders from "./pages/MyOrders";
import AdminCategories from "./pages/AdminCategories";
import ProductDetail from "./pages/ProductDetail";
import AdminProductImages from "./pages/AdminProductImages";
import NewArrival from "./pages/NewArrival";
import AddReview from "./pages/AddReview";

import { Routes, Route, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();

  // hide navbar for admin routes
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/new-arrivals" element={<NewArrival />} />
        <Route path="/add-review/:productId/:orderId" element={<AddReview />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/orders" element={<Orders />} />

        <Route path="/product/:id" element={<ProductDetail />} />

        <Route
          path="/admin/products/:id/images"
          element={<AdminProductImages />}
        />
      </Routes>
    </>
  );
}
