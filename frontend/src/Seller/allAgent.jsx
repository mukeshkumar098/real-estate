import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, X, Phone, Mail, User,
  MapPin, Star, Check, Globe
} from 'lucide-react';

export default function AgentCarousel() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [autoSlide, setAutoSlide] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/user/getverifiedSellers`);

        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }

        const data = await response.json();
        const normalizedAgents = Array.isArray(data) ? data.map(agent => ({
          id: agent._id || agent.id || Math.random().toString(36).substr(2, 9),
          name: agent.name || 'Unknown Agent',
          title: agent.title || 'Real Estate Agent',
          image: agent.image || agent.profilePicture || '/default-profile.jpg',
          rating: agent.rating || agent.averageRating || 0,
          location: agent.location || agent.address || 'Location not specified',
          properties: agent.properties || agent.propertiesSold || 0,
          specialization: agent.specialization || 'General',
          isVerified: agent.isVerified || false,
          phone: agent.phone || agent.contactNumber || '',
          email: agent.email || '',
          bio: agent.bio || agent.about || 'No biography provided.',
          languages: agent.languages || ['English'],
          agency: agent.agency || '',
          experience: agent.experience || agent.yearsOfExperience || 0,
          successRate: agent.successRate || 0
        })) : [];
        
        setAgents(normalizedAgents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    let intervalId;

    if (autoSlide && agents.length > 0) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % agents.length);
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoSlide, agents.length]);

  useEffect(() => {
    setAutoSlide(!selectedAgent);
  }, [selectedAgent]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % agents.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + agents.length) % agents.length);
  };

  const openAgentProfile = (agent) => setSelectedAgent(agent);
  const closeAgentProfile = () => setSelectedAgent(null);

  const getVisibleAgents = () => {
    if (!agents.length) return [];
    const visibleAgents = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + agents.length) % agents.length;
      visibleAgents.push({ agent: agents[index], position: i });
    }
    return visibleAgents;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading agents...</div>
      </div>
    );
  }

  if (error && agents.length === 0) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800">Error loading agents</h3>
        <p className="mt-2 text-red-700">{error}</p>
      </div>
    );
  }

  if (agents.length === 0 && !loading && !error) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800">No agents available</h3>
        <p className="mt-2 text-blue-700">There are currently no agents to display.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-8 shadow-md">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side Image Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg h-96 relative">
            <img 
              src="/agents.jpg" 
              alt="Our Professional Team"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/default-team.jpg';
                e.target.className = "w-full h-full object-contain bg-gray-100 p-4";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <h3 className="text-xl font-bold text-white">Meet Our Team</h3>
              <p className="text-sm text-white/90 mt-1">Dedicated professionals with years of experience</p>
            </div>
          </div>
          
          <div className="mt-4 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Choose Us?</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">10+ years average experience</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">500+ satisfied clients</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Local market experts</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">24/7 availability</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side Carousel Section */}
        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Expert Agents</h2>

          <div className="relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <button onClick={prevSlide} className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition">
                <ChevronLeft size={24} />
              </button>

              <div className="flex-1 relative h-96">
                <div className="absolute inset-0 flex justify-center">
                  {getVisibleAgents().map(({ agent, position }) => (
                    <div
                      key={agent.id}
                      className={`transition-all duration-500 ease-in-out absolute w-72 rounded-xl overflow-hidden shadow-xl cursor-pointer transform ${
                        position === -1
                          ? 'scale-75 -translate-x-48 opacity-60 z-10'
                          : position === 0
                          ? 'scale-100 translate-x-0 opacity-100 z-20'
                          : 'scale-75 translate-x-48 opacity-60 z-10'
                      }`}
                      onClick={() => position === 0 && openAgentProfile(agent)}
                    >
                      <div className="bg-white h-full flex flex-col">
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                          <img
                            src={agent.image}
                            alt={agent.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/default-profile.jpg';
                              e.target.className = "w-full h-full object-contain bg-gray-100 p-4";
                            }}
                          />
                          {agent.isVerified && (
                            <div className="absolute top-3 right-3 bg-blue-600 text-white p-1 rounded-full">
                              <Check size={16} />
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">{agent.name}</h3>
                              <p className="text-blue-600 text-sm font-medium">{agent.title}</p>
                            </div>
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                              <Star size={16} className="text-yellow-500 mr-1" fill="currentColor" />
                              <span className="text-sm font-medium">{agent.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center text-gray-600 text-sm">
                            <MapPin size={14} className="mr-1" />
                            <span>{agent.location}</span>
                          </div>

                          <div className="mt-auto pt-3 border-t border-gray-100">
                            <div className="flex items-center text-sm text-gray-700">
                              <span className="font-medium">{agent.properties}</span>
                              <span className="ml-1">Properties</span>
                            </div>
                            <div className="flex items-center text-sm text-blue-600 mt-1 font-medium">
                              {agent.specialization}
                            </div>
                          </div>

                          {agent.agency && (
                            <div className="mt-3 text-sm text-gray-600">
                              <span className="font-medium">Agency:</span> {agent.agency}
                            </div>
                          )}
                          {agent.experience > 0 && (
                            <div className="mt-3 text-sm text-gray-600">
                              <span className="font-medium">Experience:</span> {agent.experience} years
                            </div>
                          )}
                          {agent.successRate > 0 && (
                            <div className="mt-3 text-sm text-gray-600">
                              <span className="font-medium">Success Rate:</span> {agent.successRate}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={nextSlide} className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex justify-center mt-4">
              {agents.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 mx-1 rounded-full transition-all ${
                    index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedAgent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={closeAgentProfile} 
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
            >
              <X size={24} className="text-gray-700" />
            </button>

            <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-400 relative">
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
                  <img
                    src={selectedAgent.image}
                    alt={selectedAgent.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/default-profile.jpg';
                      e.target.className = "w-full h-full object-contain p-2";
                    }}
                  />
                </div>
              </div>
              {selectedAgent.isVerified && (
                <div className="absolute -bottom-6 left-32">
                  <div className="bg-blue-600 text-white p-1 rounded-full shadow-md">
                    <Check size={16} />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-20 px-8 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedAgent.name}</h2>
                  <p className="text-blue-600 font-medium">{selectedAgent.title}</p>
                </div>
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                  <Star size={18} className="text-yellow-500 mr-1" fill="currentColor" />
                  <span className="font-medium">{selectedAgent.rating.toFixed(1)}/5.0</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-700">
                  <Phone size={18} className="mr-2 text-gray-500" />
                  <span>{formatPhoneNumber(selectedAgent.phone)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail size={18} className="mr-2 text-gray-500" />
                  <span>{selectedAgent.email || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin size={18} className="mr-2 text-gray-500" />
                  <span>{selectedAgent.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <User size={18} className="mr-2 text-gray-500" />
                  <span>{selectedAgent.properties} Properties Sold</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-lg text-gray-800 mb-2">
                  About {selectedAgent.name.split(' ')[0]}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedAgent.bio}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-2">Specialization</h3>
                  <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedAgent.specialization}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.languages.map((lang, index) => (
                      <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <Globe size={14} className="mr-1" />
                        {lang}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
                  Contact {selectedAgent.name.split(' ')[0]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}