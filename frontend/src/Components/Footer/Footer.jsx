import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-400">Luxora Realty</h3>
            <p className="text-gray-300 mb-4">
              India's fastest growing real estate platform connecting buyers, sellers, and renters.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-gray-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-gray-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-gray-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-gray-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <Link to={"/"}><li className="text-gray-300 hover:text-gray-400 transition-colors">Home</li></Link> 
              <Link to={"/all-properties"}><li className="text-gray-300 hover:text-gray-400 transition-colors">Properties</li></Link> 
              <Link to={"/agent"}> <li className="text-gray-300 hover-gray-400 transition-colors">Agents</li></Link>
              <Link to={"/"}><li className="text-gray-300 hover:text-gray-400 transition-colors">New Projects</li></Link>
              <Link to={"/about"}><li className="text-gray-300 hover:text-gray-400 transition-colors">About Us</li></Link>
              <Link to={"/contact"}><li className="text-gray-300 hover:text-gray-400 transition-colors">Contact</li></Link>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">Popular Cities</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'].map((city) => (
                <a
                  key={city}
                  href="#"
                  className="text-gray-300 hover:text-gray-400 transition-colors text-sm"
                >
                  {city}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-gray-400" />
                <p className="text-gray-300">
                  123 Real Estate Tower, agra - 282001
                </p>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-3 text-gray-400" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-gray-400 transition-colors">
                  +91 9837819163
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-3 text-gray-400" />
                <a href="mailto:info@luxorarealty.com" className="text-gray-300 hover:text-gray-400 transition-colors">
                  mukeshkemar567@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Get the latest property updates, investment tips, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button className="bg-gray-200 hover:bg-white-600 text-gray-900 font-medium px-6 py-2 rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2025 Luxora Realty Services Limited. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-400 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-400 transition-colors text-sm">Terms of Use</a>
            <a href="#" className="text-gray-400 hover:text-gray-400 transition-colors text-sm">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;