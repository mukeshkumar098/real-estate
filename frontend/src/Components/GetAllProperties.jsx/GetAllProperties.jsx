import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../Redux-Arch/Action";
import { Link, useNavigate } from "react-router-dom";

const GetAllProperties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { properties, isLoading, isError } = useSelector((state) => state);
  const [likes, setLikes] = useState({});
  const [views, setViews] = useState({});
  const [visibleProperties, setVisibleProperties] = useState(8); // Initial number of properties to show

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handlePropertyClick = (propertyId) => {
    setViews((prev) => ({
      ...prev,
      [propertyId]: (prev[propertyId] || 0) + 1,
    }));
    navigate(`/property/${propertyId}`);
  };

  const toggleLike = (propertyId, e) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId] ? 1 : 0,
    }));
  };

  const loadMoreProperties = () => {
    setVisibleProperties((prev) => prev + 8);
  };

  if (isLoading) return <h2 className="text-center py-8">Loading...</h2>;
  if (isError) return <h2 className="text-center py-8 text-red-500">Error fetching properties</h2>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Popular Owner Properties</h1>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.length > 0 ? (
          properties.slice(0, visibleProperties).map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              isLiked={likes[property._id]}
              onClick={() => handlePropertyClick(property._id)}
              onLike={(e) => toggleLike(property._id, e)}
              views={views[property._id] || property.views || 0}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full py-12">No properties found</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        {visibleProperties < properties.length && (
          <button
            onClick={loadMoreProperties}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
          >
            Load More Properties
          </button>
        )}
        <Link 
          to="/all-properties" 
          className="bg-white border border-yellow-500 text-yellow-500 hover:bg-blue-50 font-medium py-2 px-6 rounded-full transition-colors duration-300"
        >
          See All Properties
        </Link>
      </div>

      {/* Agents Section */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">MB Preferred Agents in Bangalore</h2>
          <Link to="/agent" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-sm md:text-base">
            See all agents <span className="text-lg">→</span>
          </Link>
        </div>
        {/* Agent cards can be added here */}
      </div>
    </div>
  );
};

// Extracted PropertyCard component for better readability
const PropertyCard = ({ property, isLiked, onClick, onLike, views }) => (
  <div
    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
    onClick={onClick}
  >
    <div className="h-48 bg-gray-100 relative overflow-hidden">
      <img
        loading="lazy"
        src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
        alt={`${property.bhk || "2 BHK"} Flat`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-2 py-1 rounded-full">
        {property.status || "Ready to Move"}
      </span>
    </div>

    <div className="p-5">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-bold text-gray-900">
          {property.bhk || "2 BHK"} Flat
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
          {property.propertyType || "Apartment"}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-2">
        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        {property.location || "Whitefield, Bangalore"}
      </p>

      <div className="flex items-center justify-between mt-4">
        <p className="text-lg font-bold text-yellow-500">
          ₹{property.price?.toLocaleString("en-IN") || "80,00,000"}
        </p>
        <p className="text-gray-500 text-sm">{property.area?.built_up || "1200"} sqft</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={onLike}
          className={`flex items-center gap-1 text-sm ${isLiked ? "text-red-600" : "text-gray-400"}`}
        >
          ❤️ {isLiked ? "Liked" : "Like"} ({property.likes || 0})
        </button>
        <p className="text-xs text-gray-500">{views} views</p>
      </div>
    </div>

    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white text-md py-2 px-3 rounded-full transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-md hover:shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        View Details
      </button>
    </div>
  </div>
);

export default GetAllProperties;