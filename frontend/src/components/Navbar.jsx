import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      <Link to="/my-orders">My Orders</Link>

    </div>
  );
}
