import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { withAdminAuth } from '../../utils/adminAuth';
import { PrismaClient } from '@prisma/client';

const AdminGamesPage: React.FC = () => {
  const [games, setGames] = useState<{
    id: number;
    name: string;
    description?: string;
    minAge: number;
    maxAge: number;
    maxParticipants: number;
    imageUrl?: string;
    videoLink?: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState<Partial<{
    id: number;
    name: string;
    description?: string;
    minAge: number;
    maxAge: number;
    maxParticipants: number;
    imageUrl?: string;
    videoLink?: string;
  }> | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/admin/games');
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/games', {
        method: currentGame?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentGame),
      });

      if (!response.ok) {
        throw new Error('Failed to save game');
      }

      // Refresh games list
      fetchGames();
      
      // Close modal
      setIsModalOpen(false);
      setCurrentGame(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDeleteGame = async (gameId: number) => {
    if (!window.confirm('Are you sure you want to delete this game? This will remove the game from all events.')) return;

    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      // Refresh games list
      fetchGames();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nibog_games'); // Cloudinary upload preset

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/your-cloudinary-cloud-name/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setCurrentGame(prev => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      setError('Image upload failed');
    }
  };

  if (loading) return <AdminLayout title="Manage Games">Loading...</AdminLayout>;
  if (error) return <AdminLayout title="Manage Games">Error: {error}</AdminLayout>;

  return (
    <AdminLayout title="Manage Games">
      {/* Add Game Button */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => {
            setCurrentGame({});
            setIsModalOpen(true);
          }}
          className="bg-nibog-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          + Add New Game
        </button>
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {game.imageUrl && (
              <img 
                src={game.imageUrl} 
                alt={game.name} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
              <p className="text-gray-600 mb-2">
                Age Range: {game.minAge} - {game.maxAge} years
              </p>
              {game.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">{game.description}</p>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">
                    Max Participants: {game.maxParticipants}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setCurrentGame(game);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteGame(game.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Game Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">
              {currentGame?.id ? 'Edit Game' : 'Create New Game'}
            </h2>
            <form onSubmit={handleCreateGame}>
              <div className="mb-4">
                <label className="block mb-2">Game Name</label>
                <input
                  type="text"
                  value={currentGame?.name || ''}
                  onChange={(e) => setCurrentGame(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  value={currentGame?.description || ''}
                  onChange={(e) => setCurrentGame(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2">Minimum Age</label>
                  <input
                    type="number"
                    value={currentGame?.minAge || ''}
                    onChange={(e) => setCurrentGame(prev => ({ ...prev, minAge: Number(e.target.value) }))}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="10"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Maximum Age</label>
                  <input
                    type="number"
                    value={currentGame?.maxAge || ''}
                    onChange={(e) => setCurrentGame(prev => ({ ...prev, maxAge: Number(e.target.value) }))}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="10"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Max Participants</label>
                <input
                  type="number"
                  value={currentGame?.maxParticipants || ''}
                  onChange={(e) => setCurrentGame(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Game Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded"
                />
                {currentGame?.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={currentGame.imageUrl} 
                      alt="Game" 
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2">Video Link (Optional)</label>
                <input
                  type="url"
                  value={currentGame?.videoLink || ''}
                  onChange={(e) => setCurrentGame(prev => ({ ...prev, videoLink: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="https://youtube.com/watch?v=example"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentGame(null);
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-nibog-primary text-white px-4 py-2 rounded"
                >
                  {currentGame?.id ? 'Update Game' : 'Create Game'}
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

export default withAdminAuth(AdminGamesPage);
