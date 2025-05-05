import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavBar from './Header';
import { BACK_END_URL } from '../constant';

export default function VerifiedSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVerifiedSellers = async () => {
    try {
      const response = await axios.get(`${BACK_END_URL}/user/getverifiedSellers`);
      setSellers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedSellers();
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg text-gray-700">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">Error: {error}</div>;

  return (
    <>
      <AdminNavBar/>
     <div className="px-15 py-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Verified Sellers (Agents)</h1>
      {sellers.length === 0 ? (
        <p className="text-gray-600 text-lg">No verified sellers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sellers.map((seller) => (
            <div
              key={seller._id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{seller.name}</h2>
              <p className="text-gray-600 text-lg">{seller.email}</p>
              <p className="text-gray-500 mt-2">Role: {seller.role}</p>
              <p className="text-green-600 font-medium mt-2">✔ Verified</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
   
  );
}