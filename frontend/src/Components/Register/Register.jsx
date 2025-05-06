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
    role: "buyer"
  });

  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(registerUser(register));
      if (res) {
        toast.success("Registration successful!", {
          className: "bg-yellow-500 text-white"
        });
        navigate("/login");
      } else {
        toast.error(res?.payload?.message || "Registration failed. Try again.", {
          className: "bg-yellow-500 text-white"
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong.", {
        className: "bg-yellow-500 text-white"
      });
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen">
       <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl w-full">
        {/* Left Side - Image */}
        <div className="lg:w-1/2 bg-yellow-600 flex justify-center items-center p-6">
          <img
            src="./Images/internship-portal.webp"
            alt="Internship Portal"
            className="max-h-[400px] w-full object-contain"
          />
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 w-full p-8">
          <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={register.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
            <input
              type="email"
              name="email"
              value={register.email}
              onChange={handleChange}
              placeholder="Email Id"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
            <input
              type="password"
              name="password"
              value={register.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
            <select
              name="role"
              value={register.role}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>

            <button
              type="submit"
              className="w-full px-5 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Sign Up
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
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
