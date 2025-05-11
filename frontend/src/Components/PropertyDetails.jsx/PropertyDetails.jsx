import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPropertyById } from "../Redux-Arch/Action";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaPhone,
  FaRulerCombined,
  FaWhatsapp,
  FaCheck,
  FaRegCalendarAlt,
  FaCar,
  FaSwimmingPool
} from "react-icons/fa";
import { IoIosResize } from "react-icons/io";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropertySidebar from "./Schedul";

const geocodeAddress = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await response.json();
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }
  return null;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProperty: property, isLoading } = useSelector((state) => state);
  const [loadedImages, setLoadedImages] = useState({});
  const [coordinates, setCoordinates] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getPropertyById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (property?.address) {
      const fullAddress = `${property.address.street}, ${property.address.city}, ${property.address.state}, ${property.address.postal_code}`;
      geocodeAddress(fullAddress).then((coords) => {
        if (coords) setCoordinates(coords);
      });
    }
  }, [property]);

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };


useEffect(() => {
  dispatch(getPropertyById(id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [dispatch, id]);



  const handleContactSeller = () => {
    const phone = property.contact_info?.phone || "";
    if (!phone) {
      alert("Seller phone number not available");
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const openWhatsApp = () => {
    const phone = property.contact_info?.phone?.replace(/[^\d]/g, "");
    if (!phone) return alert("Phone number not available");

    const message = `Hello, I'm interested in the property titled "${property.title}". Can we talk?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
    
  if (!property)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        Property not found
      </div>
    );

  // Helper function to render property amenity icon
  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('pool')) return <FaSwimmingPool className="text-blue-500" />;
    if (amenityLower.includes('parking') || amenityLower.includes('garage')) return <FaCar className="text-blue-500" />;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <span className="text-blue-500">🏋️</span>;
    if (amenityLower.includes('security')) return <span className="text-blue-500">🔒</span>;
    if (amenityLower.includes('garden')) return <span className="text-blue-500">🌿</span>;
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <span className="text-blue-500">📶</span>;
    return <FaCheck className="text-blue-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title and Location */}
      <div className="mb-8">
        <span className="text-sm font-medium text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
          {(property.status || "For Sale").toUpperCase()}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-1">{property.title}</h1>
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-blue-600" />
          <span>{property.location}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 w-full">
          {/* Images Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-4 relative aspect-[16/9] bg-gray-50 rounded-2xl overflow-hidden">
                {property.images?.[activeImage] && (
                  <>
                    <img
                      src={property.images[activeImage]}
                      alt="Main property"
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        loadedImages[activeImage] ? "opacity-100" : "opacity-0"
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(activeImage)}
                      onClick={() => setIsImageModalOpen(true)}
                    />
                    {!loadedImages[activeImage] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                      {activeImage + 1}/{property.images?.length || 0}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="md:col-span-4 flex space-x-2 overflow-x-auto py-2 px-1">
                {property.images?.slice(0, 8).map((img, i) => (
                  <div 
                    key={i} 
                    className={`relative flex-none w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      activeImage === i ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img
                      src={img}
                      alt={`Property thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <FaBed className="text-blue-600 text-2xl mb-2" />
                <p className="text-gray-500 text-sm">Bedrooms</p>
                <p className="font-bold text-lg">{property.bedrooms}</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <FaBath className="text-blue-600 text-2xl mb-2" />
                <p className="text-gray-500 text-sm">Bathrooms</p>
                <p className="font-bold text-lg">{property.bathrooms}</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <IoIosResize className="text-blue-600 text-2xl mb-2" />
                <p className="text-gray-500 text-sm">Area</p>
                <p className="font-bold text-lg">{property.area?.built_up || 0} sqft</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <FaRulerCombined className="text-blue-600 text-2xl mb-2" />
                <p className="text-gray-500 text-sm">Type</p>
                <p className="font-bold text-lg">{property.property_type}</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold mb-2">Area Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Built-up Area</p>
                    <p className="font-medium">{property.area?.built_up || 0} sqft</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Carpet Area</p>
                    <p className="font-medium">{property.area?.carpet || "N/A"} sqft</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Plot Area</p>
                    <p className="font-medium">{property.area?.plot || 0} sqft</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Facing</p>
                    <p className="font-medium">{property.facing || "N/A"}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold mb-2">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Age of Property</p>
                    <p className="font-medium">{property.age || "New"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Status</p>
                    <p className="font-medium">{property.status || "For Sale"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Furnished Status</p>
                    <p className="font-medium">{property.furnishing || "Unfurnished"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Possession</p>
                    <p className="font-medium">{property.possession || "Ready to move"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description || "No description available for this property."}
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
              {property.amenities?.length ? (
                property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-3">No amenities listed</p>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Seller Information</h3>
            <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-600 text-xl font-bold">
                  {property.contact_info?.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{property.contact_info?.name || "Agent"}</p>
                  <p className="text-gray-600">{property.contact_info?.email || "Contact for more details"}</p>
                  <div className="flex items-center text-gray-700 mt-1">
                    <FaPhone className="mr-2 text-sm text-blue-600" />
                    <span>{property.contact_info?.phone || "Not Provided"}</span>
                  </div>
                </div>
              </div>
              
              <div className="md:ml-auto flex flex-col sm:flex-row gap-3">
                <button
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                  onClick={handleContactSeller}
                >
                  <FaPhone className="mr-2" /> Call Agent
                </button>
                
                <button
                  onClick={openWhatsApp}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
                >
                  <FaWhatsapp className="mr-2" /> WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
            <div className="h-80 rounded-xl overflow-hidden mb-4 border border-gray-200">
              {coordinates ? (
                <MapContainer
                  center={[coordinates.lat, coordinates.lon]}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="w-full h-full z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                  />
                  <Marker position={[coordinates.lat, coordinates.lon]}>
                    <Popup>{property.title}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="animate-pulse text-gray-500">Loading map...</div>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Property Address</p>
                  <p className="text-gray-700 mt-1">
                    {property.address?.street}, {property.address?.city}, {property.address?.state} - {property.address?.postal_code}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <PropertySidebar property={property}/>
      </div>
    </div>
  );
};

export default PropertyDetails;