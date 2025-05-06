import { useEffect, useState } from 'react';
import { Home, Users, Settings, Building, Menu, X, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavBar from './Header';



export default function RealEstateAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [allPropertiesCount,setAllPropertiesCount]=useState(0)
  const navigate=useNavigate()

  const fetchUnverifiedSellersCount = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/user/getUnverifiedSellers`);
      setUnverifiedCount(response.data.length);
    } catch (error) {
      console.error('Failed to fetch unverified sellers count:', error);
    }
  };

  const fetchVerifiedSellersCount = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/user/getverifiedSellers`);
      setVerifiedCount(response.data.length);
    } catch (error) {
      console.error('Failed to fetch verified sellers count:', error);
    }
  };
  const allProperties = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/properties/getProperties`);
      setAllPropertiesCount(response.data.length);
    } catch (error) {
      console.error('Failed to fetch verified sellers count:', error);
    }
  };
  useEffect(() => {
    fetchUnverifiedSellersCount();
    fetchVerifiedSellersCount();
    allProperties()
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white w-64 p-5 border-r shadow-lg z-50 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-72'
        } transition-transform duration-300 md:translate-x-0 md:relative md:w-72`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
            <Home size={24} /> Dashboard
          </li>
        <li onClick={()=>navigate("/GetAllProperties")} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
            <Building size={24} /> Properties
          </li>
        
          <li onClick={()=>navigate("/VerifiedSellers")}  className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
            <Users size={24} /> Agents
          </li>
          <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
            <Settings size={24} /> Settings
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
       <AdminNavBar/>


        {/* Dashboard Content */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to={"/GetAllProperties"}> <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition">
            <h3 className="text-lg font-medium">Total Properties</h3>
            <p className="text-4xl font-bold mt-2">{allPropertiesCount}</p>
          </div>
          </Link> 

          <Link to="/VerifiedSellers" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition cursor-pointer">
              <h3 className="text-lg font-medium">Total Agents</h3>
              <p className="text-4xl font-bold mt-2">{verifiedCount}</p>
            </div>
          </Link>

          <Link to="/UnverifiedSellers" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition cursor-pointer">
              <h3 className="text-lg font-medium">Pending Approvals</h3>
              <p className="text-4xl font-bold mt-2">{unverifiedCount}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}