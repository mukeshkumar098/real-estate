import { useState } from 'react';
import { FaShare, FaHeart, FaCheck, FaWhatsapp, FaCalendarAlt, FaClock } from 'react-icons/fa';

export default function PropertySidebar({ property }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [showShareOption, setShowShareOption] = useState(false);
  
  // Format price with commas (e.g., 9,500,000)
  const formattedPrice = property.price?.toLocaleString() || '0';
  
  // Calculate price per sqft
  const pricePerSqft = Math.round((property.price || 0) / (property.area?.built_up || 1));


  const handleNativeShare = () => {
    const propertyTitle = property.title || 'Real Estate Property';
    const propertyPrice = `₹${formattedPrice}`;
    const propertyLocation = property.location || 'Unknown Location';
    const propertyArea = `${property.area?.built_up || 'N/A'} sqft`;
    const propertyUrl = window.location.href;
  
    const shareText = `🏠 ${propertyTitle}\n📍 Location: ${propertyLocation}\n💰 Price: ${propertyPrice}\n📏 Area: ${propertyArea}`;
  
    if (navigator.share) {
      navigator.share({
        title: propertyTitle,
        text: shareText,
        url: propertyUrl,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      alert("Sharing is not supported on this browser. Try copying the URL.");
    }
  
    setShowShareOption(false);
  };
  
  
  const handleScheduleVisit = () => {
    // Validate inputs
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }
    
    // In a real application, you would send this data to your backend
    const visitData = {
      propertyId: property._id,
      date: selectedDate,
      time: selectedTime
    };
    
    console.log('Scheduling visit:', visitData);
    
    // Show success message
    setIsScheduled(true);
    
    // Reset form after 3 seconds and hide success message
    setTimeout(() => {
      setSelectedDate('');
      setSelectedTime('');
      setIsScheduled(false);
    }, 3000);
  };
  
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    // In a real app, you would update this on the server
    console.log(`Property ${isLiked ? 'unliked' : 'liked'}: ${property._id}`);
  };
  
  const shareOnWhatsApp = () => {
    const propertyTitle = encodeURIComponent(property.title || 'Real Estate Property');
    const propertyPrice = encodeURIComponent(`₹${formattedPrice}`);
    const propertyLocation = encodeURIComponent(property.location || 'Unknown Location');
    const propertyArea = encodeURIComponent(`${property.area?.built_up || 'N/A'} sqft`);
    const propertyUrl = encodeURIComponent(window.location.href); // current page URL
  
    const message = `🏠 *${propertyTitle}*\n📍 Location: ${propertyLocation}\n💰 Price: ${propertyPrice}\n📏 Area: ${propertyArea}\n🔗 View: ${propertyUrl}`;
  
    window.open(`https://wa.me/?text=${message}`, '_blank');
    setShowShareOption(false);
  };
  
  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="lg:w-1/3 w-full">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-24 border border-gray-100">
        {/* Price Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-3xl font-bold text-yellow-600">₹{formattedPrice}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {property.area?.built_up || 'N/A'} sqft ({pricePerSqft.toLocaleString()} ₹/sqft)
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
            onClick={handleNativeShare}
              className="p-3 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
              
            >
              <FaShare    className={`text-gray-600 ${showShareOption ? 'text-blue-500' : ''}`} />
            </button>
            
            <button 
              className="p-3 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
              onClick={handleLikeToggle}
            >
              <FaHeart className={isLiked ? "text-red-500" : "text-gray-600"} />
            </button>
          </div>
        </div>

        {/* Share dropdown */}
        {showShareOption && (
          <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Share this property</p>
            <button 
              onClick={shareOnWhatsApp}
              className="flex items-center w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <FaWhatsapp className="text-green-500 mr-3 text-xl" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        )}

        {/* Additional details section */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Price per sqft</p>
            <p className="font-semibold text-gray-800">₹{pricePerSqft.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Maintenance</p>
            <p className="font-semibold text-gray-800">₹{property.maintenance || "2,000"}/month</p>
          </div>
        </div>

        {/* Schedule visit section */}
        <div className="bg-yellow-50 p-5 rounded-xl mb-6 border border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Schedule a Visit</h4>
          
          {isScheduled ? (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center text-green-700">
                <FaCheck className="mr-2" />
                <span className="font-medium">Visit scheduled successfully!</span>
              </div>
              <p className="text-sm text-green-600 mt-2">
                We'll contact you to confirm your appointment.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 relative">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={today}
                  />
                </div>
              </div>
              
              <div className="mb-5 relative">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <button
                onClick={handleScheduleVisit}
                className="w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 cursor-pointer transition duration-200 font-medium flex items-center justify-center"
              >
                Schedule a Visit
              </button>
            </div>
          )}
        </div>

        {/* Contact immediate section */}
        <button 
          onClick={shareOnWhatsApp}
          className="w-full flex items-center justify-center bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all duration-200 mb-3 font-medium"
        >
          <FaWhatsapp className="mr-2 text-lg" /> Chat on WhatsApp
        </button>
        
        <p className="text-xs text-center text-gray-500">
          Contact agent for availability and more details
        </p>
      </div>
    </div>
  );
}