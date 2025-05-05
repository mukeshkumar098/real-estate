import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiUser, CiShoppingCart, CiMenuBurger } from "react-icons/ci";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import { FaUserAlt, FaBox, FaSignOutAlt, FaSignInAlt, FaHome, FaBuilding, FaCheckCircle, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const getInitials = () => {
    if (!user) return "";
    const { email = "" } = user;
    const firstWord = email.split('@')[0].split('.')[0];
    const secondWord = email.split('@')[1]?.split('.')[0];
    const initials = (firstWord[0] || "") + (secondWord ? secondWord[0] : "");
    return initials.toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.menu-toggle')) {
        setVisible(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation items with their icons for mobile menu
  const navItems = [
    { name: "HOME", path: "/", icon: <FaHome /> },
    { name: "BUY HOUSES", path: "/buy", icon: <FaBuilding /> },
    { name: "SOLD HOUSES", path: "/sold", icon: <FaCheckCircle /> },
    { name: "ABOUT", path: "/about", icon: <FaInfoCircle /> },
    { name: "CONTACT", path: "/contact", icon: <FaEnvelope /> }
  ];

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled 
      ? "bg-white shadow-lg py-2" 
      : "bg-white/95 backdrop-blur-sm py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-full transition-all duration-300">
              <img 
                src="/Images/logo.webp" 
                alt="logo" 
                className="w-12 h-12 rounded-full shadow-md hover:shadow-lg transform group-hover:scale-105 transition-all duration-300" 
              />
            </div>
            <h4 className="hidden sm:block text-xl md:text-2xl font-semibold text-gray-800 group-hover:text-yellow-500 transition-all duration-300">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-yellow-500 group-hover:to-yellow-600 transition-all duration-300">
                LUXORA REALTY
              </span>
            </h4>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <ul className="flex space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <NavLink 
                  key={item.name} 
                  to={item.path} 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 
                    ${isActive 
                      ? "text-white bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-md" 
                      : "text-gray-700 hover:text-yellow-500 hover:bg-yellow-50"}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </ul>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 lg:gap-6 text-gray-700">
            {/* User Icon and Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <div
                className="cursor-pointer flex items-center gap-2 transition-all duration-300 hover:opacity-80"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                {user ? (
                  isUser.profilePicture ? (
                    <div className="relative">
                      <img
                        src={isUser.profilePicture}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-yellow-400 shadow-md transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-lg rounded-full shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                        {getInitials()}
                      </span>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  )
                ) : (
                  <div className="relative p-2 rounded-full hover:bg-yellow-50 transition-all duration-300">
                    <CiUser size={24} className="text-gray-700 hover:text-yellow-500 transition duration-300" />
                  </div>
                )}
              </div>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 w-64 text-sm transition-all transform origin-top-right">
                  <div className="relative">
                    {/* Arrow tip */}
                    <div className="absolute -top-2 right-5 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                    
                    {user && (
                      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-yellow-50 rounded-t-lg">
                        <p className="font-semibold text-lg text-gray-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      </div>
                    )}
                    
                    <div className="space-y-1 py-2">
                      <button
                        className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-yellow-50 rounded-md cursor-pointer transition-all duration-300"
                        onClick={() => {
                          navigate("/profile");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <FaUserAlt className="mr-3 text-yellow-500" />
                        <span>My Profile</span>
                      </button>
                      
                      <button
                        className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-yellow-50 rounded-md cursor-pointer transition-all duration-300"
                        onClick={() => {
                          navigate("/orders");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <FaBox className="mr-3 text-yellow-500" />
                        <span>Orders</span>
                      </button>
                      
                      {user ? (
                        <button
                          className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-all duration-300"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="mr-3" />
                          <span>Logout</span>
                        </button>
                      ) : (
                        <button
                          className="flex items-center w-full px-6 py-3 text-yellow-600 hover:bg-yellow-50 rounded-md cursor-pointer transition-all duration-300"
                          onClick={() => {
                            navigate("/login");
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <FaSignInAlt className="mr-3" />
                          <span>Login</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-yellow-50 transition-all duration-300">
              <CiShoppingCart size={24} className="text-gray-700 hover:text-yellow-500 transition duration-300" />
              {/* Cart Counter Badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full shadow-md transform scale-100 hover:scale-110 transition-all duration-300">
                10
              </span>
            </Link>

            {/* Mobile Menu Icon */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-yellow-50 transition-all duration-300 menu-toggle"
              onClick={() => setVisible(true)}
              aria-label="Open mobile menu"
            >
              <CiMenuBurger size={24} className="text-gray-700 hover:text-yellow-500 transition duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {visible && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setVisible(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out ${
          visible ? "w-4/5 max-w-xs translate-x-0" : "translate-x-full w-4/5 max-w-xs"
        } md:hidden overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <img src="/Images/logo.webp" alt="logo" className="w-8 h-8 rounded-full shadow-md" />
              <h4 className="text-lg font-semibold text-yellow-500">LUXORA</h4>
            </div>
            <button
              className="p-2 rounded-full hover:bg-yellow-50 transition-all duration-300"
              onClick={() => setVisible(false)}
              aria-label="Close menu"
            >
              <IoMdClose size={20} className="text-gray-700" />
            </button>
          </div>

          <div className="py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 py-3 px-6 border-b border-gray-100 
                  ${isActive 
                    ? "text-yellow-600 bg-yellow-50 border-l-4 border-l-yellow-500" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-yellow-500"} 
                  transition-all duration-300`
                }
                onClick={() => setVisible(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* User Info in Mobile Menu */}
          <div className="mt-auto border-t">
            {user ? (
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {isUser.profilePicture ? (
                    <img
                      src={isUser.profilePicture}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-lg rounded-full">
                      {getInitials()}
                    </span>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-all duration-300"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="p-4">
                <button
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-md hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                  onClick={() => {
                    navigate("/login");
                    setVisible(false);
                  }}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;