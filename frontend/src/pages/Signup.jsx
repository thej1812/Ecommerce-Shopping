import { API_URL } from "../utils/api.js";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setError("");
      await axios.post(`${API_URL}/api/auth/signup`, form);

      setSuccess("Signup successful! Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data;
      if (typeof errorMessage === "string") {
        setError(errorMessage);
      } else if (errorMessage === "Email already registered") {
        setError("This email is already registered. Please login instead.");
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-start justify-center bg-white pt-12 md:pt-4 pb-4">
      <div className="w-full max-w-5xl min-h-[720px] md:min-h-[420px] grid grid-cols-1 md:grid-cols-2 border rounded-2xl overflow-y-hidden">
        
        {/* LEFT */}
        <div className="pt-20 pb-10 pl-10 pr-10 md:pt-8 md:pb-0 md:pl-12 md:pr-12">
          <h2 className=" text-5xl font-[italiana] mb-2">
            Create an account
          </h2>

           <h6 className="font-[italiana] mb-12 md:mb-2">
         Join to explore amazing products.
        </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 mb-6 md:mb-0 ">
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

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-red-500 mb-2 font-[Mulish]">
              {error}
            </p>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <p className="text-sm text-green-600 mb-2 font-[Mulish]">
              {success}
            </p>
          )}

          <button
            onClick={signup}
            className="w-full border border-black py-3 text-sm font-[Mulish] hover:bg-black hover:text-white transition cursor-pointer"
          >
            Create Account
          </button>
          <p className="text-sm font-[Mulish] text-gray-500 mb-8 md:mb-0 mt-8 md:mt-2 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="underline cursor-pointer text-black"
            >
              Log in
            </span>
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block">
          <img
            src="/girl3.png"
            className="w-full h-[510px] object-cover hover:grayscale transition"
            alt="Signup"
          />
        </div>
      </div>
    </div>
  );
}