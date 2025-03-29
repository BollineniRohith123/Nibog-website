import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { withAdminAuth } from '../../utils/adminAuth';
import { PrismaClient } from '@prisma/client';

const AdminCitiesPage: React.FC = () => {
  const [cities, setCities] = useState<{ id: number; name: string; description?: string; imageUrl?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<Partial<{ id: number; name: string; description?: string; imageUrl?: string }> | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/admin/cities');
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      const data = await response.json();
      setCities(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/cities', {
        method: currentCity?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentCity),
      });

      if (!response.ok) {
        throw new Error('Failed to save city');
      }

      // Refresh cities list
      fetchCities();
      
      // Close modal
      setIsModalOpen(false);
      setCurrentCity(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDeleteCity = async (cityId: number) => {
    if (!window.confirm('Are you sure you want to delete this city? This will also remove associated events.')) return;

    try {
      const response = await fetch(`/api/admin/cities/${cityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete city');
      }

      // Refresh cities list
      fetchCities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nibog_cities'); // Cloudinary upload preset

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/your-cloudinary-cloud-name/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setCurrentCity(prev => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      setError('Image upload failed');
    }
  };

  if (loading) return <AdminLayout title="Manage Cities">Loading...</AdminLayout>;
  if (error) return <AdminLayout title="Manage Cities">Error: {error}</AdminLayout>;

  return (
    <AdminLayout title="Manage Cities">
      {/* Add City Button */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => {
            setCurrentCity({});
            setIsModalOpen(true);
          }}
          className="bg-nibog-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          + Add New City
        </button>
      </div>

      {/* Cities Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {cities.map((city) => (
          <div 
            key={city.id} 
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {city.imageUrl && (
              <img 
                src={city.imageUrl} 
                alt={city.name} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{city.name}</h3>
              {city.description && (
                <p className="text-gray-600 mb-4">{city.description}</p>
              )}
              <div className="flex justify-between">
                <button 
                  onClick={() => {
                    setCurrentCity(city);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteCity(city.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* City Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">
              {currentCity?.id ? 'Edit City' : 'Create New City'}
            </h2>
            <form onSubmit={handleCreateCity}>
              <div className="mb-4">
                <label className="block mb-2">City Name</label>
                <input
                  type="text"
                  value={currentCity?.name || ''}
                  onChange={(e) => setCurrentCity(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description (Optional)</label>
                <textarea
                  value={currentCity?.description || ''}
                  onChange={(e) => setCurrentCity(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">City Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded"
                />
                {currentCity?.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={currentCity.imageUrl} 
                      alt="City" 
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentCity(null);
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-nibog-primary text-white px-4 py-2 rounded"
                >
                  {currentCity?.id ? 'Update City' : 'Create City'}
                </button>
              </div>
            </form>
              
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default withAdminAuth(AdminCitiesPage);
