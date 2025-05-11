import { useState, useEffect, useRef } from "react";
import { FaSearch, FaMapMarkerAlt, FaRupeeSign, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SearchComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // State
  const [selectedType, setSelectedType] = useState("All");
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [price, setPrice] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Get all properties from Redux store
  const allProperties = useSelector((state) => state.properties || []);
  const isLoading = useSelector((state) => state.isLoading);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close dropdown when switching to desktop view
      if (window.innerWidth >= 768) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle filtering properties
  useEffect(() => {
    let results = [...allProperties];

    if (selectedType !== "All") {
      results = results.filter(property => 
        property.property_type && 
        property.property_type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (location) {
      results = results.filter(property => 
        property.location && 
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (price) {
      results = results.filter(property => 
        property.price && 
        property.price <= Number(price)
      );
    }

    if (searchQuery) {
      results = results.filter(property => 
        (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (property.description && property.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredResults(results);
  }, [allProperties, location, selectedType, searchQuery, price]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
    setShowDropdown(false);
  };

  const resetAllFilters = () => {
    setLocation('');
    setPrice('');
    setSearchQuery('');
    setSelectedType('All');
  };

  // Property types for both mobile and desktop
  const propertyTypes = [
    { label: "All", icon: "🏠" },
    { label: "Apartment", icon: "🏢" },
    { label: "House", icon: "🏡" },
    { label: "Commercial", icon: "🏪" },
    { label: "Land", icon: "🌳" },
  ];

  return (
    <>
      {/* Desktop UI */}
      <div className="w-full hidden md:flex flex-col items-center px-4 py-6 md:py-12 bg-cover bg-center"
           style={{ backgroundImage: "url('/Images/bg.jpeg')" }}>
        {/* Header Text */}
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
          Find Your Best Dream House for <br className="hidden md:block" /> Rental, Buy & Sell…
        </h2>

        {/* Search Type Selection */}
        <div className="flex mt-4 gap-2 flex-wrap justify-center">
          {propertyTypes.map((type) => (
            <button
              key={type.label}
              onClick={() => setSelectedType(type.label)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 border transition-all duration-200 ${
                selectedType === type.label
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {/* Search Bar Container */}
        <div className="w-full md:w-3/4 mt-4 relative">
          {/* Search Inputs */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* Location Input */}
            <div className="w-full md:w-1/3">
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter Location"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-yellow-500 z-0"
                />
              </div>
            </div>

            {/* Price Input */}
            <div className="w-full md:w-1/3">
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter Max Price"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-yellow-500 z-0"
                />
              </div>
            </div>

            {/* Keyword Search Input */}
            <div className="w-full md:w-1/3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, description..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-yellow-500 z-0"
                />
              </div>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {(location || searchQuery || selectedType !== "All" || price) && (
            <div 
              ref={dropdownRef}
              className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto"
            >
              {isLoading ? (
                <div className="p-4 text-center">
                  Loading...
                </div>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((property) => (
                  <div
                    key={property._id}
                    onClick={() => handlePropertyClick(property._id)}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        {property.images && property.images[0] ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <p className="text-gray-600">{property.location}</p>
                        <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {property.description}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-yellow-600 font-medium">
                            ₹{property.price?.toLocaleString() || 'N/A'}
                          </p>
                          <span className="text-sm text-gray-500">{property.property_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-600">
                  No properties found matching your search criteria
                  <button
                    onClick={resetAllFilters}
                    className="mt-2 text-yellow-500 font-medium text-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile UI */}
      <div className="w-full md:hidden flex flex-col items-center px-4 py-6 bg-cover bg-center"
           style={{ backgroundImage: "url('/Images/bg.jpeg')" }}>
        
        {/* Header Text - Mobile Optimized */}
        <h2 className="text-xl font-bold text-center mb-3">
          Find Your Dream Home for <br /> Rental, Buy & Sell
        </h2>

        {/* Mobile Search Toggle */}
        <button 
          onClick={() => setShowDropdown(true)}
          className="w-full max-w-md flex items-center justify-between bg-white rounded-full px-4 py-3 shadow-md mb-4"
        >
          <div className="flex items-center">
            <FaSearch className="text-gray-500 mr-2" />
            <span className="text-gray-600">Search properties...</span>
          </div>
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <FaSearch className="text-white text-xs" />
          </div>
        </button>

        {/* Property Type Selection - Horizontal Scroll */}
        <div className="w-full overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex gap-2 min-w-max">
            {propertyTypes.map((type) => (
              <motion.button
                key={type.label}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedType(type.label);
                  setShowDropdown(true); // Show dropdown when type is selected
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedType === type.label
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                {type.icon} {type.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay - Fixed Position */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            ref={dropdownRef}
            className="fixed inset-0 bg-white z-50 pt-4 pb-20 px-4 overflow-y-auto"
          >
            {/* Search Header with Close Button */}
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-4 pb-4">
              <h2 className="text-xl font-bold">Search Properties</h2>
              <button 
                onClick={() => setShowDropdown(false)}
                className="p-2 rounded-full bg-gray-100 text-gray-600"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Search Inputs - Stacked for Mobile */}
            <div className="space-y-3 mb-4">
              {/* Location Input */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Price Input */}
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Max Price"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Keyword Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, description..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {(location || price || selectedType !== "All" || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {location && (
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                    <span className="mr-1">📍 {location}</span>
                    <button onClick={() => setLocation('')}>
                      <FaTimes className="text-gray-500 text-xs" />
                    </button>
                  </div>
                )}
                {price && (
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                    <span className="mr-1">₹{price}</span>
                    <button onClick={() => setPrice('')}>
                      <FaTimes className="text-gray-500 text-xs" />
                    </button>
                  </div>
                )}
                {selectedType !== "All" && (
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                    <span className="mr-1">{selectedType}</span>
                    <button onClick={() => setSelectedType('All')}>
                      <FaTimes className="text-gray-500 text-xs" />
                    </button>
                  </div>
                )}
                {searchQuery && (
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                    <span className="mr-1">🔍 {searchQuery}</span>
                    <button onClick={() => setSearchQuery('')}>
                      <FaTimes className="text-gray-500 text-xs" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Search Results */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                {filteredResults.length} {filteredResults.length === 1 ? 'Property' : 'Properties'} Found
              </h3>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-24"></div>
                  ))}
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="space-y-3">
                  {filteredResults.map((property) => (
                    <motion.div
                      key={property._id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePropertyClick(property._id)}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <div className="flex">
                        <div className="w-24 h-24 bg-gray-200 flex-shrink-0">
                          {property.images && property.images[0] ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex-1">
                          <h3 className="font-semibold text-sm line-clamp-1">{property.title}</h3>
                          <p className="text-gray-600 text-xs mt-1 flex items-center">
                            <FaMapMarkerAlt className="mr-1 text-gray-400" size={10} />
                            <span className="line-clamp-1">{property.location}</span>
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-yellow-600 font-medium text-sm">
                              ₹{property.price?.toLocaleString() || 'N/A'}
                            </p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {property.property_type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-gray-300 text-5xl mb-3">🏠</div>
                  <h4 className="text-gray-500 font-medium">No properties found</h4>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
                  <button
                    onClick={resetAllFilters}
                    className="mt-4 text-yellow-500 font-medium text-sm"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-specific styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default SearchComponent;