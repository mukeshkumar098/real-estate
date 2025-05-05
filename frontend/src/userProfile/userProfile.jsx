import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaUpload } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BACK_END_URL } from "../Components/constant";

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Initialize form data from user state
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
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
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
      
      // Only append fields that have been modified
      if (formData.name && formData.name !== user.name) {
        formDataToSend.append("name", formData.name);
      }
      
      if (formData.email && formData.email !== user.email) {
        formDataToSend.append("email", formData.email);
      }
      
      if (newImage) {
        formDataToSend.append("profilePicture", newImage);
      }
      
      // Only send request if there are changes to update
      if (formDataToSend.entries().next().done) {
        setError("No changes to update");
        setIsLoading(false);
        return;
      }

      const response = await axios.put(`${BACK_END_URL}/user/update`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update user state with new data
      if (response.data && response.data.user) {
        dispatch({ type: "UPDATE_USER", payload: response.data.user });
        setEditMode(false);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        "Failed to update profile"
      );
      console.error("Error updating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      name: user.name || "",
      email: user.email || "",
      profilePicture: user.profilePicture || "",
    });
    setNewImage(null);
    setEditMode(false);
    setError(null);
  };

  if (!user) {
    return <div className="text-center p-8">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome, {user.name}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-md group">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700 font-semibold text-sm text-center p-2">
                  No Image<br />Click to Add
                </div>
              )}
              {editMode && (
                <label
                  htmlFor="profilePicture"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <FaUpload className="text-xl" />
                  <input
                    id="profilePicture"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <div className="text-lg font-semibold text-gray-700">
              <p>{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {!editMode && (
            <button
              onClick={handleEdit}
              className="flex items-center text-sm text-blue-600 hover:underline transition-all"
              aria-label="Edit Profile"
            >
              <FaEdit className="mr-1" />
              Edit Profile
            </button>
          )}
        </div>

        {editMode && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="profilePicture" className="text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <input
                id="profilePictureInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;