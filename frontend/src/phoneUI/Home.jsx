// import { useState, useEffect, useRef } from "react";
// import { FaSearch, FaMapMarkerAlt, FaRupeeSign, FaTimes } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// const PhoneSearchComponent = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
  
//   // State
//   const [selectedType, setSelectedType] = useState("All");
//   const [location, setLocation] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [price, setPrice] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [filteredResults, setFilteredResults] = useState([]);
//   const [activeInput, setActiveInput] = useState(null);
  
//   // Get all properties from Redux store
//   const allProperties = useSelector((state) => state.properties || []);
//   const isLoading = useSelector((state) => state.isLoading);

//   // Handle filtering properties
//   useEffect(() => {
//     let results = [...allProperties];

//     if (selectedType !== "All") {
//       results = results.filter(property => property.property_type === selectedType);
//     }

//     if (location) {
//       results = results.filter(property => 
//         property.location.toLowerCase().includes(location.toLowerCase())
//       );
//     }

//     if (price) {
//       results = results.filter(property => property.price <= Number(price));
//     }

//     if (searchQuery) {
//       results = results.filter(property => 
//         property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (property.description && property.description.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//     }

//     setFilteredResults(results);
//   }, [allProperties, location, selectedType, searchQuery, price]);

//   // Handle click outside dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handlePropertyClick = (propertyId) => {
//     navigate(`/property/${propertyId}`);
//     setShowDropdown(false);
//   };

//   // Mobile optimized property types
//   const propertyTypes = [
//     { label: "All", icon: "🏠" },
//     { label: "Apartment", icon: "🏢" },
//     { label: "House", icon: "🏡" },
//     { label: "Commercial", icon: "🏪" },
//     { label: "Land", icon: "🌳" },
//   ];

//   return (
//     <div className="w-full md:hidden z-0  mdflex flex-col items-center px-4 py-6 bg-cover bg-center"
//          style={{ backgroundImage: "url('/Images/bg.jpeg')" }}>
      
//       {/* Header Text - Mobile Optimized */}
//       <h2 className="text-xl font-bold text-center mb-3">
//         Find Your Dream Home for <br /> Rental, Buy & Sell
//       </h2>

//       {/* Mobile Search Toggle */}
//       <button 
//         onClick={() => setShowDropdown(true)}
//         className="w-full max-w-md flex items-center justify-between bg-white rounded-full px-4 py-3 shadow-md mb-4"
//       >
//         <div className="flex items-center">
//           <FaSearch className="text-gray-500 mr-2" />
//           <span className="text-gray-600">Search properties...</span>
//         </div>
//         <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
//           <FaSearch className="text-white text-xs" />
//         </div>
//       </button>

//       {/* Property Type Selection - Horizontal Scroll */}
//       <div className="w-full overflow-x-auto pb-2 hide-scrollbar">
//         <div className="flex gap-2 min-w-max">
//           {propertyTypes.map((type) => (
//             <motion.button
//               key={type.label}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setSelectedType(type.label)}
//               className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${
//                 selectedType === type.label
//                   ? "bg-yellow-500 text-white shadow-md"
//                   : "bg-white text-gray-700 border border-gray-200"
//               }`}
//             >
//               {type.icon} {type.label}
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       {/* Mobile Search Overlay */}
//       <AnimatePresence>
//         {showDropdown && (
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             transition={{ type: "spring", damping: 25 }}
//             ref={dropdownRef}
//             className="fixed inset-0 bg-white z-50 pt-4 pb-20 px-4 overflow-y-auto"
//           >
//             {/* Search Header */}
//             <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-2 pb-4">
//               <h2 className="text-xl font-bold">Search Properties</h2>
//               <button 
//                 onClick={() => setShowDropdown(false)}
//                 className="p-2 rounded-full bg-gray-100"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             {/* Search Inputs - Stacked for Mobile */}
//             <div className="space-y-3 mb-4">
//               {/* Location Input */}
//               <div className="relative">
//                 <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="text"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   placeholder="Location"
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   onFocus={() => setActiveInput('location')}
//                 />
//               </div>

//               {/* Price Input */}
//               <div className="relative">
//                 <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="number"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   placeholder="Max Price"
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   onFocus={() => setActiveInput('price')}
//                 />
//               </div>

//               {/* Keyword Search */}
//               <div className="relative">
//                 <FaSearch className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search by title, description..."
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   onFocus={() => setActiveInput('search')}
//                 />
//               </div>
//             </div>

//             {/* Active Filters Display */}
//             {(location || price || selectedType !== "All") && (
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {location && (
//                   <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
//                     <span className="mr-1">📍 {location}</span>
//                     <button onClick={() => setLocation('')}>
//                       <FaTimes className="text-gray-500 text-xs" />
//                     </button>
//                   </div>
//                 )}
//                 {price && (
//                   <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
//                     <span className="mr-1">₹{price}</span>
//                     <button onClick={() => setPrice('')}>
//                       <FaTimes className="text-gray-500 text-xs" />
//                     </button>
//                   </div>
//                 )}
//                 {selectedType !== "All" && (
//                   <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
//                     <span className="mr-1">{selectedType}</span>
//                     <button onClick={() => setSelectedType('All')}>
//                       <FaTimes className="text-gray-500 text-xs" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Search Results */}
//             <div className="mb-4">
//               <h3 className="font-semibold mb-2">
//                 {filteredResults.length} {filteredResults.length === 1 ? 'Property' : 'Properties'} Found
//               </h3>

//               {isLoading ? (
//                 <div className="space-y-4">
//                   {[...Array(3)].map((_, i) => (
//                     <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-24"></div>
//                   ))}
//                 </div>
//               ) : filteredResults.length > 0 ? (
//                 <div className="space-y-3">
//                   {filteredResults.map((property) => (
//                     <motion.div
//                       key={property._id}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => handlePropertyClick(property._id)}
//                       className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
//                     >
//                       <div className="flex">
//                         <div className="w-24 h-24 bg-gray-200 flex-shrink-0">
//                           {property.images && property.images[0] ? (
//                             <img
//                               src={property.images[0]}
//                               alt={property.title}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
//                               No Image
//                             </div>
//                           )}
//                         </div>
//                         <div className="p-3 flex-1">
//                           <h3 className="font-semibold text-sm line-clamp-1">{property.title}</h3>
//                           <p className="text-gray-600 text-xs mt-1 flex items-center">
//                             <FaMapMarkerAlt className="mr-1 text-gray-400" size={10} />
//                             <span className="line-clamp-1">{property.location}</span>
//                           </p>
//                           <div className="mt-2 flex justify-between items-center">
//                             <p className="text-yellow-600 font-medium text-sm">
//                               ₹{property.price.toLocaleString()}
//                             </p>
//                             <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                               {property.property_type}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-center py-8"
//                 >
//                   <div className="text-gray-300 text-5xl mb-3">🏠</div>
//                   <h4 className="text-gray-500 font-medium">No properties found</h4>
//                   <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
//                   <button
//                     onClick={() => {
//                       setLocation('');
//                       setPrice('');
//                       setSearchQuery('');
//                       setSelectedType('All');
//                     }}
//                     className="mt-4 text-yellow-500 font-medium text-sm"
//                   >
//                     Reset All Filters
//                   </button>
//                 </motion.div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Mobile-specific styles */}
//       <style jsx>{`
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PhoneSearchComponent;