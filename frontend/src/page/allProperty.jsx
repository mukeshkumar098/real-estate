import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProperties } from "../Components/Redux-Arch/Action";
import { 
  FaHeart, 
  FaRegHeart, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaRupeeSign,
  FaBed,
  FaBath,
  FaLayerGroup
} from "react-icons/fa";
import { useMediaQuery } from 'react-responsive';

const AllProperties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { properties: allProperties, isLoading, isError } = useSelector((state) => state);
  const [likes, setLikes] = useState({});
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  
  // Filter states
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [priceCategory, setPriceCategory] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [bedrooms, setBedrooms] = useState("any");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

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
      
      // Property type filter
      const typeMatch = propertyType === "all" || 
                       property.propertyType?.toLowerCase() === propertyType.toLowerCase();
      
      // Bedrooms filter
      const bedroomMatch = bedrooms === "any" || 
                         (property.bhk && property.bhk.includes(bedrooms));
      
      return titleMatch && locationMatch && priceMatch && typeMatch && bedroomMatch;
    });
    setFilteredProperties(filtered);
  }, [allProperties, titleFilter, locationFilter, priceRange, priceCategory, propertyType, bedrooms]);

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const toggleLike = (propertyId, e) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  const handlePriceChange = (e, thumb) => {
    const value = parseInt(e.target.value);
    if (thumb === 'min') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
    setPriceCategory("all");
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
    setPropertyType("all");
    setBedrooms("any");
  };

  const activeFiltersCount = [
    titleFilter ? 1 : 0,
    locationFilter ? 1 : 0,
    priceRange[0] !== 0 || priceRange[1] !== 100000000 ? 1 : 0,
    priceCategory !== "all" ? 1 : 0,
    propertyType !== "all" ? 1 : 0,
    bedrooms !== "any" ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
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

  // Format price for display
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Find Your Dream Home</h1>
          <p className="text-gray-600 mt-1">{allProperties.length} properties available</p>
        </div>
        
        {!isMobile && (
          <div className="relative w-full md:w-auto max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by location, property, or bhk..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
            />
          </div>
        )}
        
        {isMobile && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full justify-center
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
        )}
      </div>

      {/* Mobile Search */}
      {isMobile && (
        <div className="relative w-full mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by location, property, or bhk..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar - Desktop */}
        {!isMobile && (
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-yellow-600 hover:text-yellow-800 font-medium flex items-center gap-1"
                  >
                    <FaTimes size={12} /> Reset
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="City or neighborhood"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'apartment', 'villa', 'plot', 'house'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setPropertyType(type)}
                        className={`px-3 py-1.5 text-xs rounded-md capitalize transition-colors
                          ${propertyType === type ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {['any', '1', '2', '3', '4+'].map((bed) => (
                      <button
                        key={bed}
                        onClick={() => setBedrooms(bed)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors flex items-center gap-1
                          ${bedrooms === bed ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {bed === 'any' ? 'Any' : (
                          <>
                            <FaBed size={10} /> {bed}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </label>
                  
                  <div className="mb-4 px-2">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div 
                        className="absolute h-full bg-yellow-500 rounded-full"
                        style={{
                          left: `${(priceRange[0] / 100000000) * 100}%`,
                          right: `${100 - (priceRange[1] / 100000000) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <input
                        type="range"
                        min="0"
                        max="100000000"
                        step="100000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 'min')}
                        className="w-full absolute opacity-0"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100000000"
                        step="100000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 'max')}
                        className="w-full absolute opacity-0"
                      />
                      <div className="flex justify-between w-full">
                        <div className="relative">
                          <div className="absolute -top-8 left-0 transform -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {formatPrice(priceRange[0])}
                          </div>
                          <div className="w-4 h-4 bg-white border-2 border-yellow-500 rounded-full cursor-pointer"></div>
                        </div>
                        <div className="relative">
                          <div className="absolute -top-8 right-0 transform translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {formatPrice(priceRange[1])}
                          </div>
                          <div className="w-4 h-4 bg-white border-2 border-yellow-500 rounded-full cursor-pointer"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "All Prices", value: "all" },
                      { label: "Under 50L", value: "low" },
                      { label: "50L - 1Cr", value: "medium" },
                      { label: "Over 1Cr", value: "high" }
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handlePriceCategory(item.value)}
                        className={`px-2 py-1.5 text-xs rounded-md transition-colors flex items-center justify-center gap-1
                          ${priceCategory === item.value ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {item.value !== 'all' && <FaRupeeSign size={10} />} {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile Filter Modal */}
        {isMobile && showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-4/5 h-full overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={18} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="City or neighborhood"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'apartment', 'villa', 'plot', 'house'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setPropertyType(type)}
                        className={`px-3 py-1.5 text-xs rounded-md capitalize transition-colors
                          ${propertyType === type ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {['any', '1', '2', '3', '4+'].map((bed) => (
                      <button
                        key={bed}
                        onClick={() => setBedrooms(bed)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors flex items-center gap-1
                          ${bedrooms === bed ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {bed === 'any' ? 'Any' : (
                          <>
                            <FaBed size={10} /> {bed}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </label>
                  
                  <div className="mb-4 px-2">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div 
                        className="absolute h-full bg-yellow-500 rounded-full"
                        style={{
                          left: `${(priceRange[0] / 100000000) * 100}%`,
                          right: `${100 - (priceRange[1] / 100000000) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <input
                        type="range"
                        min="0"
                        max="100000000"
                        step="100000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 'min')}
                        className="w-full absolute opacity-0"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100000000"
                        step="100000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 'max')}
                        className="w-full absolute opacity-0"
                      />
                      <div className="flex justify-between w-full">
                        <div className="relative">
                          <div className="absolute -top-8 left-0 transform -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {formatPrice(priceRange[0])}
                          </div>
                          <div className="w-4 h-4 bg-white border-2 border-yellow-500 rounded-full cursor-pointer"></div>
                        </div>
                        <div className="relative">
                          <div className="absolute -top-8 right-0 transform translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {formatPrice(priceRange[1])}
                          </div>
                          <div className="w-4 h-4 bg-white border-2 border-yellow-500 rounded-full cursor-pointer"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "All Prices", value: "all" },
                      { label: "Under 50L", value: "low" },
                      { label: "50L - 1Cr", value: "medium" },
                      { label: "Over 1Cr", value: "high" }
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handlePriceCategory(item.value)}
                        className={`px-2 py-1.5 text-xs rounded-md transition-colors flex items-center justify-center gap-1
                          ${priceCategory === item.value ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {item.value !== 'all' && <FaRupeeSign size={10} />} {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-2 bg-yellow-500 rounded-lg text-white font-medium hover:bg-yellow-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Count and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h2 className="text-lg font-semibold text-gray-800">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Available
            </h2>
            
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <button 
                  onClick={resetFilters}
                  className="text-sm text-yellow-600 hover:underline flex items-center gap-1"
                >
                  <FaTimes size={12} /> Clear filters
                </button>
              )}
              
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          {/* Property Cards */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
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
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-white/90 text-xs font-semibold px-2 py-1 rounded-full">
                        {property.status || "Ready to Move"}
                      </span>
                      {property.featured && (
                        <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
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
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {property.bhk || "2 BHK"} {property.propertyType || "Apartment"}
                      </h3>
                      <p className="text-lg font-bold text-yellow-600">
                        {formatPrice(property.price || 8000000)}
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <FaMapMarkerAlt className="mr-1.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{property.location || "Whitefield, Bangalore"}</span>
                    </p>

                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaBed className="text-gray-400" />
                          <span>{property.bedrooms || "2"} Beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaBath className="text-gray-400" />
                          <span>{property.bathrooms || "2"} Baths</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaLayerGroup className="text-gray-400" />
                          <span>{property.area?.built_up || "1200"} sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-yellow-500 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProperties;