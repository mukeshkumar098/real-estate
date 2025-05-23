import { useEffect, useState } from 'react';
import axios from 'axios';
import { Home } from 'lucide-react';

export default function GetAllProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/properties/getProperties`);
      setProperties(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">Error: {error}</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-500 flex items-center gap-2">
          <Home size={28} className="text-yellow-500" />
          All Properties
        </h1>
        <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-medium text-sm shadow">
          Total: {properties.length}
        </span>
      </div>

      {properties.length === 0 ? (
        <p className="text-gray-600 text-lg">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <img
                src={property.images?.[0] || 'https://via.placeholder.com/300'}
                alt={property.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 truncate">{property.title}</h2>
              <p className="text-gray-500 text-sm truncate">{property.location}</p>

              <div className="flex justify-between items-center mt-3">
                <p className="text-blue-600 font-semibold text-lg">${property.price}</p>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    property.status === 'Sold'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {property.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2">Type: {property.property_type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
