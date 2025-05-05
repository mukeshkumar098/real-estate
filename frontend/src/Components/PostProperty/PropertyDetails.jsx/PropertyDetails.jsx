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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <FaMapMarkerAlt className="mr-1" />
          <span>{property.location}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="lg:w-2/3">
          {/* Images with lazy loading and placeholders */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Image */}
              <div className="md:col-span-2 relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                {property.images?.[0] && (
                  <>
                    <img
                      src={`${property.images[0]}?w=800&auto=format`} // Add image optimization params
                      alt="Main property"
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        loadedImages[0] ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(0)}
                    />
                    {!loadedImages[0] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {property.images?.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={`${img}?w=400&auto=format`} // Add image optimization params
                    alt={`Property ${i + 2}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      loadedImages[i+1] ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(i+1)}
                  />
                  {!loadedImages[i+1] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rest of your component remains the same */}
          {/* Highlights */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <FaBed className="text-blue-600 mr-2 text-xl" />
                <div>
                  <p className="text-gray-500 text-sm">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaBath className="text-blue-600 mr-2 text-xl" />
                <div>
                  <p className="text-gray-500 text-sm">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center">
                <IoIosResize className="text-blue-600 mr-2 text-xl" />
                <div>
                  <p className="text-gray-500 text-sm">Area</p>
                  <p className="font-semibold">
                    Built-up: {property.area?.built_up || 0} sqft<br />
                    Carpet: {property.area?.carpet || "N/A"} sqft<br />
                    Plot: {property.area?.plot || 0} sqft
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FaRulerCombined className="text-blue-600 mr-2 text-xl" />
                <div>
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="font-semibold">{property.property_type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities?.length ? (
                property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No amenities listed</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
            <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map of {property.location}</p>
            </div>
            <div className="mt-4">
              <p className="text-gray-700">
                <span className="font-semibold">Address:</span>{" "}
                {property.address?.street}, {property.address?.city},{" "}
                {property.address?.state} - {property.address?.postal_code}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-yellow-600">₹{formattedPrice}</h3>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <FaShare className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <FaHeart className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-500">Price per sqft</p>
                <p className="font-semibold">₹{pricePerSqft.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Maintenance</p>
                <p className="font-semibold">₹{property.maintenance || "2,000"}/month</p>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center mb-4">
              <FaPhone className="mr-2" />
              {property.contact_info?.phone
                ? `Call (${property.contact_info.phone})`
                : "Contact Owner"}
            </button>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold mb-2">Schedule a Visit</h4>
              <form onSubmit={handleScheduleVisit}>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md mb-3"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-md mb-3"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
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