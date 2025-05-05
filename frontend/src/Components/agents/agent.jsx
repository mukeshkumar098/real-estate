// import React, { useState, useEffect } from 'react';
// import { FaPhone, FaEnvelope, FaWhatsapp, FaHome, FaStar, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
// import { MdVerified } from 'react-icons/md';
// import { RiHomeHeartLine } from 'react-icons/ri';

// const RealEstateAgentsListing = () => {
//   const [agents, setAgents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeTab, setActiveTab] = useState('all');

//   useEffect(() => {
//     const fetchAgents = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('http://localhost:8080/user/getverifiedSellers');

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         // Transform API data to match our expected format
//         const formattedAgents = data.map(agent => ({
//           id: agent.id || agent._id,
//           name: agent.name || `${agent.firstName} ${agent.lastName}`,
//           email: agent.email,
//           phone: agent.phone || agent.contactNumber,
//           profilePicture: agent.profilePicture || agent.avatar,
//           isVerified: agent.isVerified,
//           location: agent.location || agent.areaOfOperation,
//           specialization: agent.specialization || agent.expertise,
//           bio: agent.bio || agent.description,
//           languages: agent.languages || ['English'], // Default to English if not provided
//           propertiesSold: agent.propertiesSold || agent.transactionsCompleted || 0,
//           rating: agent.rating || agent.averageRating || 4.5 // Default rating
//         }));

//         setAgents(formattedAgents.filter(agent => agent.isVerified));
//       } catch (error) {
//         console.error('Error fetching agents:', error);
//         setError(error.message || 'Failed to fetch agents data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgents();
//   }, []);

//   const filteredAgents = agents.filter(agent =>
//     agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (agent.location && agent.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (agent.specialization && agent.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const getFilteredAgents = () => {
//     if (activeTab === 'all') return filteredAgents;
//     return filteredAgents.filter(agent => 
//       agent.specialization && agent.specialization.toLowerCase().includes(activeTab)
//     );
//   };

//   // ... [rest of the component remains the same as in the previous implementation]

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
//       {/* Header Section */}
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full px-6 py-2 mb-4">
//             <RiHomeHeartLine className="mr-2 text-xl" />
//             <span className="font-medium">Premium Agents</span>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Find Your Perfect <span className="text-blue-600">Real Estate Agent</span>
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Connect with our verified professionals who will guide you through every step of your property journey
//           </p>
//         </div>

//         {/* Search and Filter Section */}
//         <div className="mb-12">
//           <div className="max-w-2xl mx-auto relative mb-8">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
//               <FaSearch className="text-lg" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search agents by name, location, or specialty..."
//               className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="flex flex-wrap justify-center gap-3 mb-6">
//             <button
//               onClick={() => setActiveTab('all')}
//               className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
//             >
//               All Agents
//             </button>
//             <button
//               onClick={() => setActiveTab('luxury')}
//               className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'luxury' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
//             >
//               Luxury Homes
//             </button>
//             <button
//               onClick={() => setActiveTab('commercial')}
//               className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'commercial' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
//             >
//               Commercial
//             </button>
//             <button
//               onClick={() => setActiveTab('waterfront')}
//               className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'waterfront' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
//             >
//               Waterfront
//             </button>
//           </div>
//         </div>

//         {/* Agents Grid */}
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[...Array(3)].map((_, index) => (
//               <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
//                 <div className="animate-pulse">
//                   <div className="h-64 bg-gray-200"></div>
//                   <div className="p-6">
//                     <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
//                     <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-5/6 mb-6"></div>
//                     <div className="flex gap-3">
//                       <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
//                       <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
//                       <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : error ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <h3 className="text-xl font-medium text-gray-700 mb-2">Error Loading Agents</h3>
//             <p className="text-gray-500 mb-6">{error}</p>
//             <button 
//               onClick={() => window.location.reload()}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         ) : getFilteredAgents().length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//             <div className="text-gray-400 text-6xl mb-4">🏡</div>
//             <h3 className="text-xl font-medium text-gray-700 mb-2">No agents found</h3>
//             <p className="text-gray-500 max-w-md mx-auto">Try adjusting your search criteria or browse all our agents</p>
//             <button 
//               onClick={() => {
//                 setSearchTerm('');
//                 setActiveTab('all');
//               }}
//               className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Show All Agents
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {getFilteredAgents().map((agent) => (
//               <div 
//                 key={agent.id} 
//                 className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 {/* Agent Image with Badges */}
//                 <div className="relative h-64 overflow-hidden">
//                   <img
//                     src={agent.profilePicture || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"}
//                     alt={agent.name}
//                     className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//                     onError={(e) => {
//                       e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
//                     }}
//                   />
//                   <div className="absolute bottom-4 left-4 bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
//                     <MdVerified className="mr-1" />
//                     Verified
//                   </div>
//                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-sm">
//                     <FaStar className="text-yellow-500 mr-1" />
//                     {agent.rating.toFixed(1)}
//                   </div>
//                 </div>

//                 {/* Agent Info */}
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-800">{agent.name}</h2>
//                       <p className="text-gray-600">{agent.specialization || 'Real Estate Agent'}</p>
//                     </div>
//                     <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                       {agent.propertiesSold}+ sales
//                     </div>
//                   </div>

//                   {agent.location && (
//                     <div className="flex items-center text-gray-600 mb-4">
//                       <FaMapMarkerAlt className="mr-2 text-blue-500" />
//                       <span>{agent.location}</span>
//                     </div>
//                   )}

//                   {agent.bio && (
//                     <p className="text-gray-700 mb-4 line-clamp-2">{agent.bio}</p>
//                   )}

//                   <div className="flex flex-wrap gap-2 mb-6">
//                     {agent.languages.map((lang, index) => (
//                       <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
//                         {lang}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Contact Buttons */}
//                   <div className="grid grid-cols-3 gap-3">
//                     <a 
//                       href={`tel:${agent.phone}`}
//                       className="flex flex-col items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors group"
//                       title="Call Agent"
//                     >
//                       <FaPhone className="text-lg mb-1 group-hover:scale-110 transition-transform" />
//                       <span className="text-xs">Call</span>
//                     </a>
//                     <a 
//                       href={`mailto:${agent.email}`}
//                       className="flex flex-col items-center justify-center p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors group"
//                       title="Email Agent"
//                     >
//                       <FaEnvelope className="text-lg mb-1 group-hover:scale-110 transition-transform" />
//                       <span className="text-xs">Email</span>
//                     </a>
//                     <a 
//                       href={`https://wa.me/${agent.phone}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex flex-col items-center justify-center p-2 bg-[#25D366]/10 text-[#25D366] rounded-lg hover:bg-[#25D366]/20 transition-colors group"
//                       title="WhatsApp"
//                     >
//                       <FaWhatsapp className="text-lg mb-1 group-hover:scale-110 transition-transform" />
//                       <span className="text-xs">WhatsApp</span>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RealEstateAgentsListing;



















import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaWhatsapp, FaHome, FaStar, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { RiHomeHeartLine } from 'react-icons/ri';

const RealEstateAgentsListing = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Simulating API call with mock data
        const mockAgents = [
          {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah@realestate.com",
            phone: "+1234567890",
            profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            isVerified: true,
            location: "New York, NY",
            specialization: "Luxury Homes",
            bio: "Specializing in high-end properties with 10+ years of experience in Manhattan real estate.",
            languages: ["English", "Spanish"],
            propertiesSold: 127,
            rating: 4.9
          },
          {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah@realestate.com",
            phone: "+1234567890",
            profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            isVerified: true,
            location: "New York, NY",
            specialization: "Luxury Homes",
            bio: "Specializing in high-end properties with 10+ years of experience in Manhattan real estate.",
            languages: ["English", "Spanish"],
            propertiesSold: 127,
            rating: 4.9
          },
          {
            id: 3,
            name: "Michael Chen",
            email: "michael@realestate.com",
            phone: "+1987654321",
            profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            isVerified: true,
            location: "San Francisco, CA",
            specialization: "Commercial Properties",
            bio: "Commercial real estate expert focusing on tech startup spaces and office buildings.",
            languages: ["English", "Mandarin"],
            propertiesSold: 89,
            rating: 4.8
          },
          {
            id: 4,
            name: "Elena Rodriguez",
            email: "elena@realestate.com",
            phone: "+1654321890",
            profilePicture: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            isVerified: true,
            location: "Miami, FL",
            specialization: "Waterfront Properties",
            bio: "Miami's premier waterfront property specialist with international clientele.",
            languages: ["English", "Spanish", "Portuguese"],
            propertiesSold: 156,
            rating: 5.0
          },  {
            id: 5,
            name: "Sarah Johnson",
            email: "sarah@realestate.com",
            phone: "+1234567890",
            profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            isVerified: true,
            location: "New York, NY",
            specialization: "Luxury Homes",
            bio: "Specializing in high-end properties with 10+ years of experience in Manhattan real estate.",
            languages: ["English", "Spanish"],
            propertiesSold: 127,
            rating: 4.9
          },
        ];

        setAgents(mockAgents.filter(agent => agent.isVerified));
        // In your actual implementation, use:
        // const response = await fetch('http://localhost:8080/user/getverifiedSellers');
        // const data = await response.json();
        // setAgents(data.filter(agent => agent.isVerified));
      } catch (error) {
        setError('Failed to fetch agents data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilteredAgents = () => {
    if (activeTab === 'all') return filteredAgents;
    return filteredAgents.filter(agent =>
      agent.specialization?.toLowerCase().includes(activeTab)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-700">Loading our top agents...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full px-6 py-2 mb-4">
            <RiHomeHeartLine className="mr-2 text-xl" />
            <span className="font-medium">Premium Agents</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect <span className="text-blue-600">Real Estate Agent</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with our verified professionals who will guide you through every step of your property journey
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <FaSearch className="text-lg" />
            </div>
            <input
              type="text"
              placeholder="Search agents by name, location, or specialty..."
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              All Agents
            </button>
            <button
              onClick={() => setActiveTab('luxury')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'luxury' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Luxury Homes
            </button>
            <button
              onClick={() => setActiveTab('commercial')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'commercial' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Commercial
            </button>
            <button
              onClick={() => setActiveTab('waterfront')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'waterfront' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Waterfront
            </button>
          </div>
        </div>

        {/* Agents Grid */}
        {getFilteredAgents().length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">🏡</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No agents found</h3>
            <p className="text-gray-500 max-w-md mx-auto">Try adjusting your search criteria or browse all our agents</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveTab('all');
              }}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Agents
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {getFilteredAgents().map((agent) => (
            <div
              key={agent.email}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Agent Image with Badges */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={agent.profilePicture || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"}
                  alt={agent.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
        
                <div className="absolute bottom-4 left-4 bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                  <MdVerified className="mr-1" />
                  Verified
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-sm">
                  <FaStar className="text-yellow-500 mr-1" />
                  {agent.rating || '4.8'}
                </div>
              </div>
        
              {/* Agent Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{agent.name}</h2>
                    <p className="text-gray-600">{agent.specialization || 'Real Estate Agent'}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {agent.propertiesSold || '100'}+ sales
                  </div>
                </div>
        
                {agent.location && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    <span>{agent.location}</span>
                  </div>
                )}
        
                {agent.bio && (
                  <p className="text-gray-700 mb-4 line-clamp-2">{agent.bio}</p>
                )}
        
                <div className="flex flex-wrap gap-2 mb-6">
                  {agent.languages?.map((lang, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
        
                {/* Contact Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex flex-col items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors group"
                    title="Call Agent"
                  >
                    <FaPhone className="text-lg mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">Call</span>
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex flex-col items-center justify-center p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors group"
                    title="Email Agent"
                  >
                    <FaEnvelope className="text-lg mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">Email</span>
                  </a>
                  <a
                    href={`https://wa.me/${agent.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 bg-[#25D366]/10 text-[#25D366] rounded-lg hover:bg-[#25D366]/20 transition-colors group"
                    title="WhatsApp"
                  >
                    <FaWhatsapp className="text-lg mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        )}
      </div>
    </div>
  );
};

export default RealEstateAgentsListing;