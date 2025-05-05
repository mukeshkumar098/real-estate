import { useState, useRef, useEffect } from "react";
import { FaMapMarkerAlt, FaRupeeSign, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const PropertyCarousel = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [direction, setDirection] = useState(1);

  // Get properties from Redux store
  const { properties, isLoading, isError } = useSelector((state) => state);

  // Handle responsive visibility
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(4); // lg screens
      } else if (window.innerWidth >= 768) {
        setVisibleCount(3); // md screens
      } else {
        setVisibleCount(1); // sm screens
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Filter and sort properties
  const recentProperties = properties
    ? [...properties]
        .filter(property => property?.createdAt && !isNaN(new Date(property.createdAt).getTime()))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
    : [];

  const getDaysAgo = (dateString) => {
    const diffDays = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "Today" : diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
  };

  const nextSlide = () => {
    if (recentProperties.length === 0) return;
    setDirection(1);
    setCurrentIndex(prev => 
      prev >= recentProperties.length - visibleCount ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (recentProperties.length === 0) return;
    setDirection(-1);
    setCurrentIndex(prev => 
      prev === 0 ? recentProperties.length - visibleCount : prev - 1
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index * visibleCount);
  };

  // Touch handlers
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  // Get visible properties
  const visibleProperties = recentProperties.length === 0 ? [] : 
    Array.from({ length: Math.min(visibleCount, recentProperties.length - currentIndex) })
      .map((_, i) => recentProperties[currentIndex + i]);

  if (isLoading) return <div className="w-full py-8 px-4 md:px-8 bg-gray-50">Loading...</div>;
  if (isError) return <div className="w-full py-8 px-4 md:px-8 bg-gray-50">Error loading properties</div>;
  if (recentProperties.length === 0) return <div className="w-full py-8 px-4 md:px-8 bg-gray-50">No properties available</div>;

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Recently Added Properties</h2>
          
          {recentProperties.length > visibleCount && (
            <div className="flex gap-3">
              <button 
                onClick={prevSlide}
                className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors hover:shadow-lg"
                aria-label="Previous property"
              >
                <FaChevronLeft className="text-gray-700 text-lg" />
              </button>
              <button 
                onClick={nextSlide}
                className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors hover:shadow-lg"
                aria-label="Next property"
              >
                <FaChevronRight className="text-gray-700 text-lg" />
              </button>
            </div>
          )}
        </div>

        <div 
          ref={carouselRef}
          className="relative w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={`${currentIndex}-${visibleCount}`} // Unique key based on index and count
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6`}
            >
              {visibleProperties.map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, x: direction * 50 * (i + 1) }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:border-yellow-300"
                >
                  <div className="relative h-56 w-full">
                    <img
                      src={property.images?.[0] || "/images/default-property.jpg"}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-3 left-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      New
                    </div>
                    {property.createdAt && (
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                        {getDaysAgo(property.createdAt)}
                      </div>
                    )}
                    <div className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
                      property.mapAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                      {property.mapAvailable ? 'Map Available' : 'Map Not Available'}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                        {property.title}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                        {property.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <FaMapMarkerAlt className="mr-2 text-yellow-500" />
                      <span className="text-sm">
                        {property.location?.address || 'Location not specified'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-5">
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        <span className="font-medium mr-1">{property.bedrooms || 'N/A'}</span> beds
                      </div>
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        <span className="font-medium mr-1">{property.bathrooms || 'N/A'}</span> baths
                      </div>
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        {property.area?.built_up ? (
                          <span className="font-medium">{property.area.built_up} sqft</span>
                        ) : property.area?.carpet ? (
                          <span className="font-medium">{property.area.carpet} sqft</span>
                        ) : (
                          <span className="font-medium">N/A</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-yellow-600 font-bold text-md">
                        <FaRupeeSign className="mr-1" />
                        <span>{property.price?.toLocaleString() || 'Price not available'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/property/${property._id || property.id}`);
                        }}
                        className="px-3 py-1.5 cursor-pointer bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors shadow-md hover:shadow-lg"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {recentProperties.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(recentProperties.length / visibleCount) }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex >= i * visibleCount && currentIndex < (i + 1) * visibleCount 
                    ? "bg-yellow-500 w-6" 
                    : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyCarousel;