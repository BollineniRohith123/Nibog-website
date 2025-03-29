import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { withAdminAuth } from '../../utils/adminAuth';
import { PrismaClient } from '@prisma/client';

const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<{
    id: number; 
    name: string; 
    description?: string; 
    startDate: Date; 
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<{
    id: number; 
    name: string; 
    description?: string; 
    startDate: Date; 
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  }> | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/events', {
        method: currentEvent?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentEvent),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      // Refresh events list
      fetchEvents();
      
      // Close modal
      setIsModalOpen(false);
      setCurrentEvent(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Refresh events list
      fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (loading) return <AdminLayout title="Manage Events">Loading...</AdminLayout>;
  if (error) return <AdminLayout title="Manage Events">Error: {error}</AdminLayout>;

  return (
    <AdminLayout title="Manage Events">
      {/* Add Event Button */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => {
            setCurrentEvent({});
            setIsModalOpen(true);
          }}
          className="bg-nibog-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          + Add New Event
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-white shadow-md rounded">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{event.name}</td>
                <td className="p-3">{new Date(event.startDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <span 
                    className={`px-2 py-1 rounded text-xs ${
                      event.status === 'UPCOMING' ? 'bg-green-100 text-green-800' :
                      event.status === 'ONGOING' ? 'bg-yellow-100 text-yellow-800' :
                      event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button 
                    onClick={() => {
                      setCurrentEvent(event);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">
              {currentEvent?.id ? 'Edit Event' : 'Create New Event'}
            </h2>
            <form onSubmit={handleCreateEvent}>
              <div className="mb-4">
                <label className="block mb-2">Event Name</label>
                <input
                  type="text"
                  value={currentEvent?.name || ''}
                  onChange={(e) => setCurrentEvent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Date</label>
                <input
                  type="date"
                  value={currentEvent?.startDate ? new Date(currentEvent.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setCurrentEvent(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Status</label>
                <select
                  value={currentEvent?.status || 'UPCOMING'}
                  onChange={(e) => {
                    const newStatus = e.target.value as 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
                    setCurrentEvent(prev => {
                      if (!prev) return null;
                      return { 
                        ...prev, 
                        status: newStatus 
                      };
                    });
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentEvent(null);
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-nibog-primary text-white px-4 py-2 rounded"
                >
                  {currentEvent?.id ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default withAdminAuth(AdminEventsPage);
