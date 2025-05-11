import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPropertyById } from "../Redux-Arch/Action";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaPhone,
  FaShare,
  FaHeart,
  FaRulerCombined,
} from "react-icons/fa";
import { IoIosResize } from "react-icons/io";

const PropertyDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProperty: property, isLoading } = useSelector((state) => state);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loadedImages, setLoadedImages] = useState({});
  const [hoveredHeading, setHoveredHeading] = useState(null);

  useEffect(() => {
    dispatch(getPropertyById(id));
  }, [dispatch, id]);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">Loading...</div>
    );
  if (!property)
    return (
      <div className="flex justify-center items-center min-h-screen">Property not found</div>
    );

  // Calculate price per sqft
  const builtUpArea = property.area?.built_up || 1;
  const pricePerSqft = property.price ? Math.round(property.price / builtUpArea) : 0;
  const formattedPrice = property.price?.toLocaleString("en-IN") || "80,00,000";

  const handleScheduleVisit = (e) => {
    e.preventDefault();
    alert(`Visit scheduled for ${selectedDate} at ${selectedTime}`);
  };

  // Interactive heading style
  const headingStyle = (headingId) => `
    text-2xl font-bold mb-4 border-b pb-2 transition-all duration-300
    ${hoveredHeading === headingId ? 
      'text-yellow-600 border-yellow-600 scale-[1.01]' : 
      'text-yellow-500 border-gray-200'}
    hover:text-yellow-600 hover:border-yellow-600 hover:scale-[1.01]
  `;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Main Header with enhanced interaction */}
      <div className="mb-6 group">
        <h1 
          className="text-3xl font-bold text-yellow-500 mb-2 transition-all duration-300 
          hover:text-yellow-600 transform hover:scale-[1.01] cursor-pointer"
          onMouseEnter={() => setHoveredHeading('main')}
          onMouseLeave={() => setHoveredHeading(null)}
        >
          {property.title}
        </h1>
        <div className="flex items-center text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
          <FaMapMarkerAlt className="mr-1 text-yellow-500 group-hover:text-yellow-600" />
          <span className="text-lg">{property.location}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="lg:w-2/3">
          {/* Property Highlights with interactive heading */}
          <div 
            className="bg-white rounded-xl shadow-sm p-6 mb-8 hover:shadow-md transition-shadow duration-300"
            onMouseEnter={() => setHoveredHeading('highlights')}
            onMouseLeave={() => setHoveredHeading(null)}
          >
            <h2 className={headingStyle('highlights')}>Property Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: <FaBed className="text-yellow-500 mr-2 text-xl" />, label: "Bedrooms", value: property.bedrooms },
                { icon: <FaBath className="text-yellow-500 mr-2 text-xl" />, label: "Bathrooms", value: property.bathrooms },
                { icon: <IoIosResize className="text-yellow-500 mr-2 text-xl" />, label: "Area", value: `Built-up: ${property.area?.built_up || 0} sqft` },
                { icon: <FaRulerCombined className="text-yellow-500 mr-2 text-xl" />, label: "Type", value: property.property_type }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 rounded-lg hover:bg-yellow-50 transition-colors duration-200"
                >
                  {item.icon}
                  <div>
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description with interactive heading */}
          <div 
            className="bg-white rounded-xl shadow-sm p-6 mb-8 hover:shadow-md transition-shadow duration-300"
            onMouseEnter={() => setHoveredHeading('description')}
            onMouseLeave={() => setHoveredHeading(null)}
          >
            <h2 className={headingStyle('description')}>Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities with interactive heading */}
          <div 
            className="bg-white rounded-xl shadow-sm p-6 mb-8 hover:shadow-md transition-shadow duration-300"
            onMouseEnter={() => setHoveredHeading('amenities')}
            onMouseLeave={() => setHoveredHeading(null)}
          >
            <h2 className={headingStyle('amenities')}>Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities?.length ? (
                property.amenities.map((amenity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-2 rounded hover:bg-yellow-50 transition-colors duration-200"
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No amenities listed</p>
              )}
            </div>
          </div>

          {/* Location with interactive heading */}
          <div 
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
            onMouseEnter={() => setHoveredHeading('location')}
            onMouseLeave={() => setHoveredHeading(null)}
          >
            <h2 className={headingStyle('location')}>Location</h2>
            <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">Map of {property.location}</p>
            </div>
            <div className="mt-4 p-3 rounded-lg hover:bg-yellow-50 transition-colors duration-200">
              <p className="text-gray-700">
                <span className="font-semibold">Address:</span>{" "}
                {property.address?.street}, {property.address?.city},{" "}
                {property.address?.state} - {property.address?.postal_code}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Price Card */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-yellow-500 hover:text-yellow-600 transition-colors duration-200">
                ₹{formattedPrice}
              </h3>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-yellow-100 transition-colors duration-200">
                  <FaShare className="text-gray-600 hover:text-yellow-500 transition-colors duration-200" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-yellow-100 transition-colors duration-200">
                  <FaHeart className="text-gray-600 hover:text-yellow-500 transition-colors duration-200" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="p-2 rounded-lg hover:bg-yellow-50 transition-colors duration-200">
                <p className="text-gray-500">Price per sqft</p>
                <p className="font-semibold">₹{pricePerSqft.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg hover:bg-yellow-50 transition-colors duration-200">
                <p className="text-gray-500">Maintenance</p>
                <p className="font-semibold">₹{property.maintenance || "2,000"}/month</p>
              </div>
            </div>

            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow hover:shadow-md">
              <FaPhone className="mr-2" />
              {property.contact_info?.phone
                ? `Call (${property.contact_info.phone})`
                : "Contact Owner"}
            </button>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold mb-2 text-yellow-500 hover:text-yellow-600 transition-colors duration-200 cursor-pointer">
                Schedule a Visit
              </h4>
              <form onSubmit={handleScheduleVisit}>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-200 hover:border-yellow-400"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-200 hover:border-yellow-400"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow hover:shadow-md"
                >
                  Request Visit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;