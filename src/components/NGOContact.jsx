import { useEffect, useState } from 'react';
import { get } from '../api';

export default function NGOContact() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const response = await get('/auth/users?role=NGO');
        setNgos(response || []);
      } catch (error) {
        console.error('Failed to fetch NGOs:', error);
        setNgos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading NGO contacts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">NGO Contacts</h2>

      {ngos.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No NGO contacts available</div>
          <div className="text-gray-400 text-sm mt-2">
            NGO contact information will appear here once registered
          </div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
            >
              {/* NGO Name */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {ngo.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Registered on:{' '}
                    {new Date(ngo.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">📞</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-gray-800">
                      {ngo.contact}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-yellow-600 text-sm">🏷️</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Role</div>
                    <div className="font-medium text-gray-800">{ngo.role}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => (window.location.href = `tel:${ngo.contact}`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Call Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
