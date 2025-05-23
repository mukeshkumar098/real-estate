import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${import.meta.env.VITE_BACK_END_URL}/user/admin-verify-seller/${sellerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "Seller verified successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      fetchSellers(); // refresh
    } catch (err) {
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-yellow-500">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-yellow-500 mr-4"></div>
        Loading Sellers...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-600">
        {error}
      </div>
    );

  return (
    <>
      <ToastContainer />
      <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-extrabold text-yellow-500 mb-8">Unverified Sellers</h1>

        {sellers.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No unverified sellers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {sellers.map((seller) => (
              <div
                key={seller._id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
              >
                <img
                  src={seller.profileImage || 'https://via.placeholder.com/150'}
                  alt={seller.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-2 border-yellow-500"
                />
                <h2 className="text-xl font-bold text-center text-gray-800">{seller.name}</h2>
                <p className="text-sm text-center text-gray-500 mb-3">{seller.email}</p>

                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Phone:</strong> {seller.phone || 'N/A'}</p>
                  <p><strong>Company:</strong> {seller.company || 'N/A'}</p>
                  <p><strong>Address:</strong> {seller.address || 'N/A'}</p>
                  <p><strong>Role:</strong> {seller.role}</p>
                  <p><strong>Listings:</strong> {seller.listingsCount ?? '0'}</p>
                  <p><strong>Joined:</strong> {new Date(seller.createdAt).toLocaleDateString()}</p>
                  <p>
                    <strong>Status:</strong>
                    <span className={`ml-1 font-semibold ${seller.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {seller.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => handleVerifySeller(seller._id)}
                  disabled={seller.isVerified}
                  className={`mt-4 w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
                    seller.isVerified
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {seller.isVerified ? 'Verified' : 'Verify Seller'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
