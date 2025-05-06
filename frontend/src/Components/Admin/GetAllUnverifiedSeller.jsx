import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavBar from './Header';

export default function AdminUnVerifySeller() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/user/getUnverifiedSellers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSellers(response.data);
    } catch (err) {
      setError('Error fetching sellers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySeller = async (sellerId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(`${import.meta.env.VITE_BACK_END_URL}/user/admin-verify-seller/${sellerId}`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // ✅ Show Success Toast Notification
      toast.success(response.data.message || "Seller verified successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      fetchSellers(); // Refresh seller list after verification
    } catch (err) {
      // ❌ Show Error Toast Notification
      toast.error('Error verifying seller: ' + (err.response?.data?.message || err.message), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg text-blue-600"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-600"></div>Loading Sellers...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-lg text-red-600">{error}</div>;

  return (
    <>
      <AdminNavBar />
      <ToastContainer /> {/* ✅ Required for toasts to appear */}
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Unverified Sellers</h1>
        {sellers.length === 0 ? (
          <p className="text-center text-gray-600 text-xl">No unverified sellers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sellers.map((seller) => (
              <div key={seller._id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transform transition-transform hover:scale-105 hover:shadow-2xl hover:border-gray-300 duration-300">
                <h2 className="text-xl font-semibold text-gray-800">{seller.name}</h2>
                <p className="text-gray-600 mb-4">{seller.email}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleVerifySeller(seller._id)}
                    className={`${
                      seller.isVerified ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                    } px-6 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105`}
                    disabled={seller.isVerified}
                  >
                    {seller.isVerified ? 'Verified' : 'Verify Seller'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}