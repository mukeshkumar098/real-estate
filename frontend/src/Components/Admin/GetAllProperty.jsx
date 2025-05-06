import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavBar from './Header';

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

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">Error: {error}</div>;

  return (
    <>
      <AdminNavBar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">All Properties</h1>
        {properties.length === 0 ? (
          <p className="text-gray-600">No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-xl duration-300"
              >
                <img
                  src={property.images[0] || 'https://via.placeholder.com/300'}
                  alt={property.title}
                  className="w-full h-56 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800">{property.title}</h2>
                <p className="text-gray-600">{property.location}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-lg font-medium text-blue-600">${property.price}</p>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      property.status === 'Sold' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                <p className="text-gray-500 mt-2">Type: {property.property_type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}