import { useState, useEffect, useCallback, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchProperties } from "../Redux-Arch/Action";
import debounce from 'lodash/debounce';
import PhoneSearchComponent from "../../phoneUI/Home";

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
  
  // Get all properties from Redux store
  const allProperties = useSelector((state) => state.properties || []);
  const isLoading = useSelector((state) => state.isLoading);

  // Handle filtering properties based on all criteria
  useEffect(() => {
    let results = [...allProperties];

    // Filter by property type
    if (selectedType !== "All") {
      results = results.filter(property => property.property_type === selectedType);
    }

    // Filter by location
    if (location) {
      results = results.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by price
    if (price) {
      results = results.filter(property => property.price <= Number(price));
    }

    // Filter by search query (title and description)
    if (searchQuery) {
      results = results.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (property.description && property.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredResults(results);
    setShowDropdown(location || searchQuery || selectedType !== "All" || price);
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

  return (<>
   <div className="w-full hidden md:flex flex-col   items-center px-4 py-6 md:py-12 bg-cover bg-center"
         style={{ backgroundImage: "url('/Images/bg.jpeg')" }}>
      {/* Header Text */}
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
        Find Your Best Dream House for <br className="hidden md:block" /> Rental, Buy & Sell…
      </h2>

      {/* Search Type Selection */}
      <div className="flex mt-4 gap-2 flex-wrap justify-center">
        {[
          { label: "All", icon: "🏠" },
          { label: "Apartment", icon: "🏢" },
          { label: "House", icon: "🏡" },
          { label: "Commercial", icon: "🏪" },
          { label: "Land", icon: "🌳" },
        ].map((type) => (
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
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-yellow-500 z-0"
            />
          </div>

          {/* Price Input */}
          <div className="w-full md:w-1/3">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Max Price"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-yellow-500 z-0"
            />
          </div>

          {/* Keyword Search Input */}
          <div className="w-full md:w-1/3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-yellow-500 z-0"
            />
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && (
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
                          ₹{property.price.toLocaleString()}
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    <PhoneSearchComponent/>
  </>
   
  );
};

export default SearchComponent;