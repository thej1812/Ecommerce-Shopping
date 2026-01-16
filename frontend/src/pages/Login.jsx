import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const login = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userId", res.data.userId);

    if (res.data.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="p-6">
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={login}>Login</button>
    </div>
  );
}
