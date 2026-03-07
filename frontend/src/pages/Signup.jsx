import { API_URL } from "../utils/api.js";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // ✅ error message
  const navigate = useNavigate();

  const signup = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setError("");
      await axios.post(`${API_URL}/api/auth/signup`, form);
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-start justify-center bg-white pt-4 pb-4">
      <div className="w-full max-w-5xl h-[660px] md:h-[520px] grid grid-cols-1 md:grid-cols-2 border rounded-2xl overflow-y-hidden">
        
        {/* LEFT */}
        <div className="p-10 md:p-7">
          <h2 className="text-3xl font-[italiana] mb-2">
            Create an account
          </h2>

          <p className="text-sm font-[Mulish] text-gray-500 mb-8">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="underline cursor-pointer text-black"
            >
              Log in
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-[Mulish]">
                First name
              </label>
              <input
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border rounded-md px-4 py-2 focus:ring-1 focus:ring-black outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block font-[Mulish]">
                Last name
              </label>
              <input className="w-full border rounded-md px-4 py-2 focus:ring-1 focus:ring-black outline-none" />
            </div>
          </div>

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

          <div className="mb-4">
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

          {/* ✅ ERROR MESSAGE (ABOVE BUTTON) */}
          {error && (
            <p className="text-[10px] text-red-500 mb-2 font-[Mulish]">
              {error}
            </p>
          )}

          <button
            onClick={signup}
            className="w-full border border-black py-3 text-sm font-[Mulish] hover:bg-black hover:text-white transition cursor-pointer"
          >
            Create Account
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block">
          <img
            src="/girl3.png"
            className="w-full h-full object-cover hover:grayscale transition"
            alt="Signup"
          />
        </div>
      </div>
    </div>
  );
}
