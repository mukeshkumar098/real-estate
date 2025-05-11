import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchProperties } from "../Components/Redux-Arch/Action";
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaSearch, FaFilter, FaTimes, FaRupeeSign } from "react-icons/fa";
import { useMediaQuery } from 'react-responsive';

const AllProperties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { properties: allProperties, isLoading, isError } = useSelector((state) => state);
  const [likes, setLikes] = useState({});
  const [views, setViews] = useState({});
  
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);


  
  // Filter states
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [priceCategory, setPriceCategory] = useState("all");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  useEffect(() => {
    const filtered = allProperties.filter(property => {
      // Title filter
      const titleMatch = property.bhk?.toLowerCase().includes(titleFilter.toLowerCase()) || 
                       property.title?.toLowerCase().includes(titleFilter.toLowerCase());
      
      // Location filter
      const locationMatch = property.location?.toLowerCase().includes(locationFilter.toLowerCase());
      
      // Price range filter
      let priceMatch = property.price >= priceRange[0] && property.price <= priceRange[1];
      
      // Price category filter
      if (priceCategory !== "all") {
        if (priceCategory === "low") {
          priceMatch = property.price <= 5000000;
        } else if (priceCategory === "medium") {
          priceMatch = property.price > 5000000 && property.price <= 10000000;
        } else if (priceCategory === "high") {
          priceMatch = property.price > 10000000;
        }
      }
      
      return titleMatch && locationMatch && priceMatch;
    });
    setFilteredProperties(filtered);
  }, [allProperties, titleFilter, locationFilter, priceRange, priceCategory]);

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




  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
    setPriceCategory("all"); // Reset category when manually adjusting range
  };

  const handlePriceCategory = (category) => {
    setPriceCategory(category);
    if (category === "low") {
      setPriceRange([0, 5000000]);
    } else if (category === "medium") {
      setPriceRange([5000001, 10000000]);
    } else if (category === "high") {
      setPriceRange([10000001, 100000000]);
    } else {
      setPriceRange([0, 100000000]);
    }
  };

  const resetFilters = () => {
    setTitleFilter("");
    setLocationFilter("");
    setPriceRange([0, 100000000]);
    setPriceCategory("all");
  };

  const activeFiltersCount = [
    titleFilter ? 1 : 0,
    locationFilter ? 1 : 0,
    priceRange[0] !== 0 || priceRange[1] !== 100000000 ? 1 : 0,
    priceCategory !== "all" ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  );
  
  if (isError) return (
    <div className="text-center py-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">Failed to fetch properties.</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">All Properties</h1>
          <p className="text-gray-600 mt-1">Find your perfect home</p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
            ${showFilters ? 'bg-gray-200 text-gray-800' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
        >
          {showFilters ? <FaTimes /> : <FaFilter />}
          {showFilters ? "Hide Filters" : "Show Filters"}
          {activeFiltersCount > 0 && (
            <span className="bg-white text-yellow-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Properties</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Property title or BHK"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}
                />
              </div>
            </div>
            
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="City or neighborhood"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </label>
              
              {/* Price Category Quick Filters */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => handlePriceCategory("all")}
                  className={`px-3 py-1 text-xs rounded-full ${priceCategory === "all" ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  All Prices
                </button>
                <button
                  onClick={() => handlePriceCategory("low")}
                  className={`px-3 py-1 text-xs rounded-full ${priceCategory === "low" ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FaRupeeSign className="inline mr-1" /> Under 50L
                </button>
                <button
                  onClick={() => handlePriceCategory("medium")}
                  className={`px-3 py-1 text-xs rounded-full ${priceCategory === "medium" ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FaRupeeSign className="inline mr-1" /> 50L - 1Cr
                </button>
                <button
                  onClick={() => handlePriceCategory("high")}
                  className={`px-3 py-1 text-xs rounded-full ${priceCategory === "high" ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FaRupeeSign className="inline mr-1" /> Over 1Cr
                </button>
              </div>
              
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="100000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                  className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                  className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹10 Cr</span>
              </div>
            </div>
          </div>
          
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="text-yellow-600 hover:text-yellow-800 text-sm font-medium flex items-center gap-1"
              >
                <FaTimes /> Reset all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Found
        </h2>
        {activeFiltersCount > 0 && !showFilters && (
          <button 
            onClick={() => setShowFilters(true)}
            className="text-sm text-yellow-600 hover:underline"
          >
            Adjust filters
          </button>
        )}
      </div>

      {/* Property Cards */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
              onClick={() => handlePropertyClick(property._id)}
            >
              {/* Property Image */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img
                  loading="lazy"
                  src={
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  }
                  alt={`${property.bhk || "2 BHK"} Flat`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-2 py-1 rounded-full">
                  {property.status || "Ready to Move"}
                </span>
                <button
                  onClick={(e) => toggleLike(property._id, e)}
                  className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-red-100 transition-colors"
                >
                  {likes[property._id] ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400" />
                  )}
                </button>
              </div>

              {/* Property Details */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {property.bhk || "2 BHK"} Flat
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                    {property.propertyType || "Apartment"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-1 text-gray-400" />
                  {property.location || "Whitefield, Bangalore"}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-bold text-yellow-600">
                    ₹{property.price?.toLocaleString("en-IN") || "80,00,000"}
                  </p>
                  <p className="text-gray-500 text-sm">{property.area?.built_up || "1200"} sqft</p>
                </div>

                {/* Additional Info */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(property.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <p className="text-xs text-gray-500">
                    {views[property._id] || property.views || 0} views
                  </p>
                </div>
              </div>

              {/* Hover Action */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-4 rounded-full transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-md hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropertyClick(property._id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <FaSearch className="text-yellow-500 text-xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No properties match your filters</h3>
          <p className="mt-2 text-gray-600">Try adjusting your search criteria</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllProperties;