import { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaRupeeSign, FaExpand, FaBed, FaBath, FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

const PropertySliderCarousel = () => {
  // Get properties from Redux store
  const { properties, isLoading, isError } = useSelector((state) => state);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter properties by category and sort by date
  const filteredProperties = properties
    ? [...properties]
        .filter(property => {
          // Only include properties with valid creation date
          if (!property?.createdAt || isNaN(new Date(property.createdAt).getTime())) {
            return false;
          }
          
          // Filter by category if not "all"
          if (selectedCategory !== "all") {
            return property.type?.toLowerCase() === selectedCategory.toLowerCase();
          }
          
          return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  // Get categories for filter buttons
  const categories = ["all", ...new Set(properties?.map(p => p.type?.toLowerCase()).filter(Boolean) || [])];

  // Move to specified slide
  const goToSlide = (index) => {
    if (isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Move to next slide
  const nextSlide = () => {
    if (filteredProperties.length <= 1) return;
    const newIndex = activeIndex === filteredProperties.length - 1 ? 0 : activeIndex + 1;
    goToSlide(newIndex);
  };

  // Move to previous slide
  const prevSlide = () => {
    if (filteredProperties.length <= 1) return;
    const newIndex = activeIndex === 0 ? filteredProperties.length - 1 : activeIndex - 1;
    goToSlide(newIndex);
  };

  // Set up autoplay
  useEffect(() => {
    if (filteredProperties.length <= 1) return;
    
    // Start autoplay
    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    
    // Clean up on unmount
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [activeIndex, filteredProperties.length]);

  // Reset carousel when category changes
  useEffect(() => {
    setActiveIndex(0);
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  }, [selectedCategory]);

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  // Resume autoplay when mouse leaves
  const handleMouseLeave = () => {
    if (filteredProperties.length > 1) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
  };

  // Get relative time
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
  };

  // Loading and error states
  if (isLoading) return (
    <div className="w-full py-8 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
        <div className="h-96 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="w-full py-8 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <h3 className="text-red-600 font-medium">Error loading properties</h3>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    </div>
  );
  
  if (filteredProperties.length === 0) return (
    <div className="w-full py-12 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Featured Properties</h2>
        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <p className="text-gray-600">No properties available in this category.</p>
          <button 
            onClick={() => setSelectedCategory("all")}
            className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition-colors"
          >
            View All Properties
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with title */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Featured Properties</h2>
          <div className="h-0.5 w-24 bg-yellow-500"></div>
        </div>
        
        {/* Category filter */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Carousel container */}
        <div 
          className="relative bg-white rounded-xl shadow-lg overflow-hidden" 
          ref={carouselRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main slider */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            {filteredProperties.map((property, index) => (
              <div
                key={property._id || property.id}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === activeIndex 
                    ? "opacity-100 translate-x-0" 
                    : index < activeIndex 
                      ? "opacity-0 -translate-x-full" 
                      : "opacity-0 translate-x-full"
                }`}
              >
                <div className="h-full flex flex-col md:flex-row">
                  {/* Image section - Fixed responsive image container */}
                  <div className="relative w-full md:w-7/12 h-60 md:h-full overflow-hidden bg-gray-100">
                    <img
                      src={property.images?.[0] || "/images/default-property.jpg"}
                      alt={property.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading={index === activeIndex ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/30 md:to-transparent"></div>
                    
                    {/* Top left badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="flex gap-2">
                        <span className="bg-yellow-500 text-white text-xs px-2.5 py-1 rounded-md font-medium">
                          {property.type}
                        </span>
                        {property.mapAvailable && (
                          <span className="bg-green-500/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md">
                            Map
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Property title overlay (mobile only) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden z-10">
                      <h3 className="font-bold text-xl text-white">
                        {property.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-1.5 text-yellow-400" size={12} />
                        <span className="text-white/90 text-sm truncate">
                          {property.location?.address || 'Location not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="relative w-full md:w-5/12 p-6 md:p-8 flex flex-col">
                    {/* Desktop title */}
                    <div className="hidden md:block mb-6">
                      <h3 className="font-bold text-2xl text-gray-800 mb-2">
                        {property.title}
                      </h3>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1.5 text-yellow-500" size={14} />
                        <span className="text-gray-600">
                          {property.location?.address || 'Location not specified'}
                        </span>
                      </div>
                      
                      {/* Date added */}
                      {property.createdAt && (
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <FaCalendarAlt className="mr-1.5 text-yellow-500" size={12} />
                          <span>Added {getTimeAgo(property.createdAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Specifications */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <FaBed className="text-yellow-500 mb-1" size={20} />
                        <span className="text-xs text-gray-500">Beds</span>
                        <span className="font-medium text-gray-800">{property.bedrooms || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <FaBath className="text-yellow-500 mb-1" size={20} />
                        <span className="text-xs text-gray-500">Baths</span>
                        <span className="font-medium text-gray-800">{property.bathrooms || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <FaExpand className="text-yellow-500 mb-1" size={20} />
                        <span className="text-xs text-gray-500">Area</span>
                        <span className="font-medium text-gray-800">
                          {property.area?.built_up || property.area?.carpet || 'N/A'}
                          {(property.area?.built_up || property.area?.carpet) ? <span className="text-xs"> sqft</span> : ''}
                        </span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    {property.description && (
                      <div className="mb-auto">
                        <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                        <p className="text-sm text-gray-600 line-clamp-4 md:line-clamp-6">
                          {property.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Price and action */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center text-yellow-600 font-bold text-xl">
                        <FaRupeeSign className="mr-1" />
                        <span>{property.price?.toLocaleString() || 'Price not available'}</span>
                      </div>
                      
                      <button
                        onClick={() => {/* View property details */}}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation controls */}
          {filteredProperties.length > 1 && (
            <>
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
                <button
                  onClick={prevSlide}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-50 transition-colors"
                  aria-label="Previous property"
                  disabled={isAnimating}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
                <button
                  onClick={nextSlide}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 shadow-md text-white hover:bg-yellow-600 transition-colors"
                  aria-label="Next property"
                  disabled={isAnimating}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Dots navigation */}
        {filteredProperties.length > 1 && (
          <div className="flex justify-center mt-6">
            {filteredProperties.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`mx-1 w-3 h-3 rounded-full transition-all ${
                  idx === activeIndex ? 'bg-yellow-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Property thumbnails - mini preview */}
        {filteredProperties.length > 1 && !isMobile && (
          <div className="mt-6 overflow-x-auto pb-2">
            <div className="flex gap-2 justify-center">
              {filteredProperties.map((property, idx) => (
                <button
                  key={property._id || property.id}
                  onClick={() => goToSlide(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                    idx === activeIndex ? 'ring-2 ring-yellow-500 ring-offset-2' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="absolute inset-0 bg-gray-100">
                    <img 
                      src={property.images?.[0] || "/images/default-property.jpg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertySliderCarousel;