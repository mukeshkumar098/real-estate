import React, { useState } from "react";
import {
  FaHome,
  FaBuilding,
  FaChartLine,
  FaHandshake,
  FaUsers,
  FaAward,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaChevronDown
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [hoveredTeam, setHoveredTeam] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };
  

  const features = [
    {
      icon: <FaHome className="text-3xl text-yellow-500" />,
      title: "Luxury Properties",
      description: "Exclusive collection of high-end homes and estates",
      details: "We specialize in luxury properties with premium amenities, from waterfront mansions to penthouse apartments in the most desirable locations."
    },
    {
      icon: <FaChartLine className="text-3xl text-yellow-500" />,
      title: "Market Expertise",
      description: "Data-driven insights for smart investments",
      details: "Our team provides comprehensive market analysis to help you make informed decisions about property values and investment opportunities."
    },
    {
      icon: <FaHandshake className="text-3xl text-yellow-500" />,
      title: "Personalized Service",
      description: "Tailored solutions for every client",
      details: "We take time to understand your unique needs and preferences, offering customized property recommendations and negotiation strategies."
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "With over 20 years in luxury real estate, Sarah has helped hundreds of clients find their dream homes."
    },
    {
      name: "Michael Chen",
      role: "Lead Agent",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Specializing in commercial properties and investments, Michael brings financial expertise to every transaction."
    },
    {
      name: "Elena Rodriguez",
      role: "Interior Specialist",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Elena helps clients visualize properties' potential with her exceptional staging and design skills."
    }
  ];

  const milestones = [
    { year: "2010", title: "Company Founded", description: "Started with a small office in downtown" },
    { year: "2014", title: "First $10M Sale", description: "Sold our first luxury penthouse" },
    { year: "2017", title: "Expanded to 3 Cities", description: "Opened offices in Miami and New York" },
    { year: "2020", title: "1000+ Clients", description: "Helped over 1000 families find homes" },
    { year: "2023", title: "Luxury Award", description: "Recognized as top luxury brokerage" }
  ];


  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-50"
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury home"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-40 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Building <span className="text-yellow-400">Dreams</span>, Not Just Homes
          </h1>
          <p className="mt-6 text-xl text-yellow-100 max-w-3xl mx-auto">
            For over a decade, we've been transforming real estate experiences with integrity, expertise, and personalized service.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="mb-12 lg:mb-0">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our <span className="text-yellow-500">Story</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Founded in 2010, Premier Estate began with a simple mission: to make real estate transactions seamless and rewarding for our clients.
            </p>
            <p className="mt-4 text-gray-600">
              What started as a small boutique agency has grown into one of the most respected names in luxury real estate, thanks to our unwavering commitment to client satisfaction and market expertise.
            </p>
            <div className="mt-8">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition transform hover:-translate-y-1"
                >
                  Meet Our Team
                </a>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition duration-500">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Office building"
              />
              <div className="absolute inset-0 bg-yellow-500 mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500 hidden lg:block">
              <FaAward className="text-4xl text-yellow-500 mb-2" />
              <p className="font-bold text-gray-900">Top Luxury Brokerage</p>
              <p className="text-sm text-gray-600">2023 Real Estate Awards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why <span className="text-yellow-500">Choose Us</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              We go beyond traditional real estate services to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-gray-50 p-8 rounded-xl shadow-md border-l-4 border-yellow-400 transition-all duration-300 hover:shadow-lg hover:border-yellow-500 cursor-pointer ${activeAccordion === index ? 'bg-white' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  <FaChevronDown className={`text-yellow-500 transition-transform ${activeAccordion === index ? 'transform rotate-180' : ''}`} />
                </div>
                {activeAccordion === index && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-gray-600">
                    {feature.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our <span className="text-yellow-500">Team</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Meet the dedicated professionals who make the difference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${hoveredTeam === index ? 'transform -translate-y-2 shadow-lg' : ''}`}
              onMouseEnter={() => setHoveredTeam(index)}
              onMouseLeave={() => setHoveredTeam(null)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  src={member.image}
                  alt={member.name}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300 ${hoveredTeam === index ? 'opacity-70' : ''}`} />
                <div className={`absolute bottom-0 left-0 p-6 transition-all duration-300 ${hoveredTeam === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <p className="text-yellow-100">{member.bio}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-yellow-600 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our <span className="text-yellow-500">Journey</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-yellow-400 transform -translate-x-1/2" />

            <div className="space-y-8 md:space-y-0">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`relative md:flex ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
                >
                  <div className={`md:w-1/2 p-6 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-yellow-400 hover:shadow-lg transition">
                      <div className="absolute -top-4 -left-4 md:left-auto md:-right-4 bg-yellow-500 text-white rounded-full h-12 w-12 flex items-center justify-center font-bold shadow-lg">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-yellow-500">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to find your <span className="text-gray-900">dream property</span>?
          </h2>
          <p className="mt-4 text-xl text-yellow-100 max-w-3xl mx-auto">
            Our expert agents are standing by to help you navigate the market with confidence.
          </p>
          <div className="mt-8">
           <Link to={"/contact"}><p
              
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-yellow-700 bg-white hover:bg-gray-100 transition transform hover:-translate-y-1 hover:shadow-md"
            >
              <IoMdSend className="mr-2" />
              Contact Us Today
            </p></Link> 
          </div>
        </div>
      </div>

      {/* Footer */}
 
    </div>
  );
};

export default AboutPage;