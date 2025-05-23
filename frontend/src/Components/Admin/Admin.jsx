import React, { useEffect, useState } from "react";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { Home, Building, Users, Settings, UserX } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VerifiedSellers from "./Seller";
import GetAllProperties from "./GetAllProperty";
import AdminUnVerifySeller from "./GetAllUnverifiedSeller";
import StatCard from "./setCart";

const RealEstateAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [verifiedCount, setVerifiedCount] = useState(0);
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  const [allPropertiesCount, setAllPropertiesCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [errorCounts, setErrorCounts] = useState(null);

  const fetchCounts = async () => {
    setLoadingCounts(true);
    setErrorCounts(null);
    try {
      const verified = await axios.get("/api/verified-sellers");
      const unverified = await axios.get("/api/unverified-sellers");
      const properties = await axios.get("/api/properties");

      setVerifiedCount(verified.data.length);
      setUnverifiedCount(unverified.data.length);
      setAllPropertiesCount(properties.data.length);
    } catch (error) {
      setErrorCounts("Failed to fetch counts");
      console.error(error);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <Home size={20} />, tab: "Dashboard" },
    { label: "Properties", icon: <Building size={20} />, tab: "Properties" },
    { label: "Agents", icon: <Users size={20} />, tab: "Agents" },
    { label: "Unverified Sellers", icon: <UserX size={20} />, tab: "UnverifiedSellers" },
    { label: "Settings", icon: <Settings size={20} />, tab: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Mobile Header */}
     {/* Mobile Header */}
<div className="lg:hidden flex items-center justify-between bg-white px-4 py-3 shadow-md sticky top-0 z-20">
  <h1 className="text-xl font-bold text-yellow-500">Admin Panel</h1>
  <button
    className="text-yellow-500 focus:outline-none"
    onClick={() => setSidebarOpen(!sidebarOpen)}
  >
    <FaBars size={20} />
  </button>
</div>

{/* Desktop Header */}



      {/* Sidebar */}
      <aside
        className={`bg-white w-full lg:w-64 border-r transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static top-0 left-0 h-full z-50`}
      >
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-yellow-500 hidden lg:block">Admin Panel</h1>
        </div>
        <ul className="space-y-2 px-4 pt-2">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                setActiveTab(item.tab);
                setSidebarOpen(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveTab(item.tab);
                  setSidebarOpen(false);
                }
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
                activeTab === item.tab
                  ? "bg-yellow-100 text-yellow-600 font-semibold border-l-4 border-yellow-400"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="hidden lg:flex justify-end items-center px-6 py-4 border-b bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">Admin</span>
            <button
              onClick={handleLogout}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded flex items-center gap-1"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {activeTab === "Dashboard" && (
            <>
              {loadingCounts && (
                <p className="text-center text-gray-500">Loading stats...</p>
              )}
              {errorCounts && (
                <p className="text-center text-red-600">{errorCounts}</p>
              )}
              {!loadingCounts && !errorCounts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard
                    label="Total Properties"
                    count={allPropertiesCount}
                    onClick={() => setActiveTab("Properties")}
                  />
                  <StatCard
                    label="Total Agents"
                    count={verifiedCount}
                    onClick={() => setActiveTab("Agents")}
                  />
                  <StatCard
                    label="Pending Approvals"
                    count={unverifiedCount}
                    onClick={() => setActiveTab("UnverifiedSellers")}
                  />
                </div>
              )}
            </>
          )}

          {activeTab === "Properties" && <GetAllProperties />}
          {activeTab === "Agents" && <VerifiedSellers />}
          {activeTab === "UnverifiedSellers" && <AdminUnVerifySeller />}
          {activeTab === "Settings" && (
            <div>
              <h2 className="text-xl font-bold">Settings</h2>
              <p className="text-gray-600 mt-2">Admin configuration goes here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RealEstateAdminDashboard;
