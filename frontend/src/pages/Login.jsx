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
    // Validation
    if (!form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
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
      const errorMessage = err.response?.data?.message || err.response?.data;
      if (typeof errorMessage === 'string') {
        setError(errorMessage);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }
  };
return (
 <div className="flex justify-center bg-white pt-12 pb-6 md:pt-2 px-4">
    <div className="w-full max-w-5xl min-h-[720px] md:min-h-[520px] grid grid-cols-1 md:grid-cols-2 border rounded-2xl overflow-hidden">

      {/* LEFT IMAGE */}
      <div className="hidden md:block">
        <img
          src="/girl2.png"
          alt="Login"
          className="w-full h-full object-cover hover:grayscale transition"
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="p-8 md:p-6 flex flex-col justify-center">
        <h2 className="text-5xl font-[italiana] mb-2">
          Welcome back
        </h2>

       <h6 className="font-[italiana] mb-2">
         Log in to continue exploring our collection.
        </h6>

        <div className="mb-6 mt-6">
          <label className="text-sm text-gray-600 mb-2  block font-[Mulish]">
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
          className="w-full border border-black py-3 text-sm font-[Mulish] hover:bg-black hover:text-white transition cursor-pointer"
        >
          Log in
        </button>
         <p className="text-sm font-[Mulish] text-gray-500 mb-8 mt-8 text-center" >
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="underline cursor-pointer text-black"
          >
            Create one
          </span>
        </p>
      </div>

    </div>
  </div>
);
}
