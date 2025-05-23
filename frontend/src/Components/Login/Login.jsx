import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GrLinkedin } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../Redux-Arch/Action";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!login.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(login.email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    if (!login.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (login.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await dispatch(loginUser(login));
      const token = res?.payload?.token || res?.token;

      if (token) {
        localStorage.setItem("authToken", token);
      }

      const role = res?.payload?.user?.role || res?.user?.role;
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
        {/* Left - Image */}
        <div className="md:w-1/2 bg-yellow-500 flex items-center justify-center p-6">
          <img
            src="./Images/internship-portal.webp"
            alt="Login Visual"
            className="max-h-[400px] w-full object-contain"
          />
        </div>

        {/* Right - Form */}
        <div className="md:w-1/2 w-full p-10">
          <h2 className="text-3xl font-bold text-center text-yellow-600 mb-8">Welcome Back</h2>

          {/* Social Logins */}
          <div className="space-y-4 mb-6">
            <button className="w-full py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:shadow-md transition">
              <FcGoogle size={24} />
              <span>Log in with Google</span>
            </button>
            <button className="w-full py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:shadow-md transition">
              <GrLinkedin size={20} />
              <span>Log in with LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-5">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                value={login.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-yellow-600"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={login.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-yellow-600"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition"
            >
              Log In
            </button>
          </form>

          {/* Extra Links */}
          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <div>
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
              <span className="mx-2">|</span>
              <Link to="/reset-password" className="text-blue-600 hover:underline">
                Reset Password
              </Link>
            </div>
            <div>
              <span>Don't have an account? </span>
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
