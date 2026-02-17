import { API_URL } from "../utils/api.js";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({});
   const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setError("");
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-start justify-center bg-white pt-12 pb-4 md:pt-4 ">
      <div className="w-full max-w-5xl h-[520px] md:h-[520px] grid grid-cols-1 md:grid-cols-2 border rounded-2xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden md:block">
          <img
            src="/girl2.png"
            alt="Login"
            className="w-full h-full object-cover hover:grayscale transition"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="p-10 md:p-7 flex flex-col justify-center">
          <h2 className="text-3xl font-[italiana] mb-2">
            Welcome back
          </h2>

          <p className="text-sm font-[Mulish] text-gray-500 mb-8">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="underline cursor-pointer text-black"
            >
              Create one
            </span>
          </p>

          <div className="mb-6">
            <label className="text-sm text-gray-600 mb-2 block font-[Mulish]">
              Email address
            </label>
            <input
              type="email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full border rounded-md px-4 py-2 focus:ring-1 focus:ring-black outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-600 mb-2 block font-[Mulish]">
              Password
            </label>
            <input
  type={showPassword ? "text" : "password"}
  onChange={(e) =>
    setForm({ ...form, password: e.target.value })
  }
  className="w-full border rounded-md px-4 py-2 focus:ring-1 focus:ring-black outline-none"
/>

          </div>
              <div className="flex items-center gap-2 mb-6 font-[Mulish]">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="accent-black"
            />
            <span className="text-sm text-gray-600">
              Show password
            </span>
          </div>
          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-red-500 mb-4 font-[Mulish]">
              {error}
            </p>
          )}

          <button
            onClick={login}
            className="w-full border border-black py-3 text-sm font-[Mulish] hover:bg-black hover:text-white transition"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
