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

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser(login));

      const token = res?.payload?.token || res?.token;
      if (token) {
        localStorage.setItem("authToken", token);
      }

      const role = res?.payload?.user?.role || res?.user?.role;
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "buyer") {
        navigate("/");
      } else if (role === "seller") {
        navigate("/");
      }
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
        {/* Left - Image */}
        <div className="md:w-1/2 bg-yellow-600 flex items-center justify-center p-6">
          <img
            src="./Images/internship-portal.webp"
            alt="Internship Portal"
            className="max-h-[400px] w-full object-contain"
          />
        </div>

        {/* Right - Form */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-center text-yellow-600 mb-6">Welcome Back</h2>

          {/* Social Logins */}
          <div className="space-y-4 mb-4">
            <button className="w-full py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <FcGoogle size={24} />
              <span>Log in with Google</span>
            </button>
            <button className="w-full py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <GrLinkedin size={24} />
              <span>Log in with LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-sm text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={login.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
            <input
              type="password"
              name="password"
              value={login.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition"
            >
              Log In
            </button>
          </form>

          {/* Extra Links */}
          <div className="mt-4 text-center space-y-2 text-sm text-gray-600">
            <div>
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
              <span className="mx-2">|</span>
              <Link to="/reset-password" className="text-blue-500 hover:underline">
                Reset Password
              </Link>
            </div>
            <div>
              <span>Don’t have an account? </span>
              <Link to="/register" className="text-blue-500 hover:underline">
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
