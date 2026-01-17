import "./App.css";
import Navbar from "./components/Navbar";
import AdminProducts from "./pages/AdminProducts";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyOrders from "./pages/MyOrders";
import AdminCategories from "./pages/AdminCategories";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
     <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/signup" element={<Signup />} />
<Route path="/login" element={<Login />} />

<Route path="/my-orders" element={<MyOrders />} />

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
    </Routes></>
  );
}
