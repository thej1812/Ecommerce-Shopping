import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const signup = async () => {
    await axios.post("http://localhost:5000/api/auth/signup", form);
    alert("Signup successful");
    navigate("/login");
  };

  return (
    <div className="p-6">
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={signup}>Signup</button>
    </div>
  );
}
