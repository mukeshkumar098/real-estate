import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaUpload, FaLock } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", profilePicture: "" });
  const [newImage, setNewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFormData({
      name: user.name || "",
      email: user.email || "",
      profilePicture: user.profilePicture || "",
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      if (formData.name && formData.name !== user.name) formDataToSend.append("name", formData.name);
      if (formData.email && formData.email !== user.email) formDataToSend.append("email", formData.email);
      if (newImage) formDataToSend.append("profilePicture", newImage);

      if (formDataToSend.entries().next().done) {
        setError("No changes to update");
        setIsLoading(false);
        return;
      }

      const response = await axios.put(`${import.meta.env.VITE_BACK_END_URL}/user/update`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.user) {
        dispatch({ type: "UPDATE_USER", payload: response.data.user });
        setEditMode(false);
      } else throw new Error("Invalid server response");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      profilePicture: user.profilePicture || "",
    });
    setNewImage(null);
    setEditMode(false);
    setError(null);
  };

  const handlePasswordChange = () => setIsPasswordModalOpen(true);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-yellow-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin w-8 h-8 mb-3 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-yellow-600 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    const initials = name.split(" ").map((part) => part[0].toUpperCase()).join("");
    return initials || "??";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6">Welcome, {user.name}</h2>

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">{error}</div>
      )}

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-300 shadow-md group">
          {formData.profilePicture ? (
            <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 text-yellow-600 font-bold text-3xl">
              {getInitials(user.name)}
            </div>
          )}
          {editMode && (
            <label htmlFor="profilePicture" className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <FaUpload />
              <input type="file" id="profilePicture" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>

        <div className="text-center md:text-left flex-1">
          <p className="text-xl font-semibold text-gray-700">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          {!editMode && (
            <button onClick={handleEdit} className="mt-3 text-yellow-600 hover:text-yellow-700 hover:underline transition cursor-pointer">
              <FaEdit className="inline mr-1" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm border border-gray-300 rounded-lg cursor-pointer file:py-2 file:px-4 file:bg-yellow-50 file:border-none file:text-yellow-700 hover:file:bg-yellow-100"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleCancel} className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer">
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg cursor-pointer">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-gray-800">{user.name || "Not set"}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg cursor-pointer">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{user.email || "Not set"}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg sm:col-span-2 cursor-pointer">
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="text-green-600 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active
            </p>
          </div>
        </div>
      )}

      <button onClick={handlePasswordChange} className="mt-6 w-full py-3 text-yellow-700 bg-yellow-100 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-200 cursor-pointer">
        <FaLock />
        Change Password
      </button>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 backdrop-blur-lg flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
            <form className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Old Password</label>
                <input type="password" className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
