import { useEffect, useState } from "react";
import axios from "axios";
import { UserCheck } from "lucide-react";

export default function VerifiedSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVerifiedSellers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACK_END_URL}/user/getverifiedSellers`
      );
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

  if (loading)
    return (
      <div className="text-center mt-10 text-lg text-gray-700">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 mt-10">Error: {error}</div>
    );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-500">
          Verified Sellers
        </h1>
        <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-medium text-sm shadow">
          Total: {sellers.length}
        </span>
      </div>

      {sellers.length === 0 ? (
        <p className="text-gray-600 text-lg">No verified sellers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sellers.map((seller) => (
            <div
              key={seller._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-500 text-white rounded-full p-3">
                  <UserCheck size={24} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {seller.name}
                  </h2>
                  <p className="text-sm text-gray-500 break-words truncate max-w-[180px]">
                    {seller.email}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                  Role:{" "}
                  <span className="font-medium text-gray-800">
                    {seller.role}
                  </span>
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  ✔ Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
