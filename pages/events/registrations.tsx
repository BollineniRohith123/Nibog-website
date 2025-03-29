import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

interface Registration {
  id: number;
  event: {
    id: number;
    name: string;
    date: string;
    city: { name: string };
  };
  game: {
    name: string;
    minAge: number;
    maxAge: number;
  };
  childName: string;
  childAge: number;
  parentName: string;
  contactEmail: string;
}

const EventRegistrationsPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/registrations?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch registrations');

        const data = await response.json();
        setRegistrations(data);
        setLoading(false);
      } catch (err) {
        setError('Unable to load registrations');
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-nibog-primary">
          My Event Registrations
        </h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading registrations...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : registrations.length === 0 ? (
          <div className="text-center text-gray-500">
            You have no registrations yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map(reg => (
              <div 
                key={reg.id} 
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2 text-nibog-primary">
                  {reg.event.name}
                </h2>
                <div className="text-gray-600 space-y-2">
                  <p>
                    <strong>Date:</strong> {format(new Date(reg.event.date), 'PP')}
                  </p>
                  <p>
                    <strong>City:</strong> {reg.event.city.name}
                  </p>
                  <p>
                    <strong>Game:</strong> {reg.game.name}
                  </p>
                  <div className="border-t pt-2 mt-2">
                    <p>
                      <strong>Child:</strong> {reg.childName} (Age {reg.childAge})
                    </p>
                    <p>
                      <strong>Parent:</strong> {reg.parentName}
                    </p>
                    <p>
                      <strong>Contact:</strong> {reg.contactEmail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventRegistrationsPage;
