import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiUser, CiShoppingCart, CiMenuBurger } from "react-icons/ci";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import { FaUserAlt, FaBox, FaSignOutAlt, FaSignInAlt, FaHome, FaBuilding, FaCheckCircle, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../Redux-Arch/Action";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navRef = useRef(null);

  const isUser = useSelector((state) => state.userProfile);
  console.log(isUser,"nsnsakhhyg");
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setVisible(false); // Hide sidebar on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrolled = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrolled);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const getInitials = () => {
    if (!user || !user.name) return "";
    const nameParts = user.name.trim().split(" ");
    const firstInitial = nameParts[0]?.charAt(0) || "";
    const lastInitial = nameParts[1]?.charAt(0) || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (windowWidth < 768 && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.menu-toggle')) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [windowWidth]);

  const navItems = [
    { name: "HOME", path: "/", icon: <FaHome /> },
    { name: "BUY HOUSES", path: "/all-properties", icon: <FaBuilding /> },
    { name: "SOLD HOUSES", path: "/sold", icon: <FaCheckCircle /> },
    { name: "ABOUT", path: "/about", icon: <FaInfoCircle /> },
    { name: "CONTACT", path: "/contact", icon: <FaEnvelope /> }
  ];

  return (
    <div ref={navRef}>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-100 ease-linear ${scrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/95 backdrop-blur-sm py-4"}`}
        style={{ willChange: 'transform' }}
      >
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
                    isUser?.profilePicture ? (
                      <div className="relative">
                        <img
                          src={`${import.meta.env.VITE_BACK_END_URL}${isUser.profilePicture}`}
                          alt="User"
                          className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-yellow-400 shadow-md transition-all duration-300"
                        />
                        {/* <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
                      </div>
                    ) : (
                      <div className="relative">
                        <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-lg rounded-full shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                          {getInitials()}
                        </span>
                        {/* <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
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
                    {user ? (
                      <>
                        <div className="p-4 border-b">
                          <div className="flex items-center gap-3">
                            {isUser?.profilePicture ? (
                              <img
                                src={`${import.meta.env.VITE_BACK_END_URL}${isUser.profilePicture}`}
                                alt="User"
                                className="w-10 h-10 rounded-full border-2 border-gray-200"
                              />
                            ) : (
                              <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-lg rounded-full">
                                {getInitials()}
                              </span>
                            )}
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">Premium Member</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-yellow-50 text-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FaUserAlt className="text-yellow-500" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-yellow-50 text-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FaBox className="text-yellow-500" />
                            <span>My Orders</span>
                          </Link>
                        </div>
                        <div className="p-2 border-t">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-red-50 text-red-500"
                          >
                            <FaSignOutAlt />
                            <span>Logout</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-2">
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-yellow-50 text-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaSignInAlt className="text-yellow-500" />
                          <span>Login</span>
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-yellow-50 text-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaUserAlt className="text-yellow-500" />
                          <span>Register</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Mobile Menu Icon */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-yellow-50 transition-all duration-300 menu-toggle"
                onClick={() => setVisible(prev => !prev)}
                aria-label="Toggle mobile menu"
              >
                {visible ?
                  <IoMdClose size={24} className="text-gray-700 hover:text-yellow-500 transition duration-300" /> :
                  <CiMenuBurger size={24} className="text-gray-700 hover:text-yellow-500 transition duration-300" />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {visible && windowWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
          onClick={() => setVisible(false)}
        ></div>
      )}

      {/* Mobile Sidebar - Now hidden on desktop */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out
          ${visible ? "translate-x-0" : "translate-x-full"}
          w-4/5 max-w-xs 
          md:hidden`} // Changed this line to hide on desktop
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

          {/* User Info in Sidebar */}
          <div className="mt-auto border-t">
            {user ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    {isUser?.profilePicture ? (
                      <img
                        src={`${import.meta.env.VITE_BACK_END_URL}${isUser.profilePicture}`}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                      />
                    ) : (
                      <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-lg rounded-full">
                        {getInitials()}
                      </span>
                    )}
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">Premium Member</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-yellow-50 text-gray-700 text-sm"
                    onClick={() => setVisible(false)}
                  >
                    <FaUserAlt className="text-yellow-500" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-yellow-50 text-gray-700 text-sm"
                    onClick={() => setVisible(false)}
                  >
                    <FaBox className="text-yellow-500" />
                    <span>My Orders</span>
                  </Link>
                </div>
                <div className="p-2 border-t">
                  <button
                    onClick={() => {
                      handleLogout();
                      setVisible(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-red-50 text-red-500 text-sm"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2">
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-yellow-50 text-gray-700 text-sm"
                  onClick={() => setVisible(false)}
                >
                  <FaSignInAlt className="text-yellow-500" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-yellow-50 text-gray-700 text-sm"
                  onClick={() => setVisible(false)}
                >
                  <FaUserAlt className="text-yellow-500" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump */}
      <div className={`h-${scrolled ? '16' : '24'} transition-all duration-100`}></div>
    </div>
  );
};

export default Navbar;