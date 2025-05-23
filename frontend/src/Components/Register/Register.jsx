import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../Redux-Arch/Action";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { name, email, password } = register;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) return "Name is required.";
    if (!emailRegex.test(email)) return "Enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error, {
        className: "bg-yellow-500 text-white",
      });
      return;
    }

    try {
      const res = await dispatch(registerUser({ ...register, role: "buyer" }));
      if (res) {
        toast.success("Registration successful!", {
          className: "bg-yellow-500 text-white",
        });
        navigate("/login");
      } else {
        toast.error(res?.payload?.message || "Registration failed. Try again.", {
          className: "bg-yellow-500 text-white",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong.", {
        className: "bg-yellow-500 text-white",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">
        {/* Left Side - Image */}
        <div className="lg:w-1/2 bg-yellow-500 flex justify-center items-center p-6">
          <img
            src="./Images/internship-portal.webp"
            alt="Register"
            className="max-h-[400px] w-full object-contain"
          />
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 w-full p-10">
          <h1 className="text-4xl font-bold text-yellow-500 text-center mb-6">Create an Account</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={register.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={register.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={register.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters.</p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-lg hover:bg-yellow-600 transition"
            >
              Register
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline font-medium">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
