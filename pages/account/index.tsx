import React, { useState, useEffect } from 'react';
import { useUser, UserProfile } from '@clerk/nextjs';
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
  };
  childName: string;
  childAge: number;
}

const AccountPage: React.FC = () => {
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
        <div className="grid md:grid-cols-2 gap-8">
          {/* User Profile Section */}
          <div>
            <h1 className="text-3xl font-bold mb-6 text-nibog-primary">
              My Profile
            </h1>
            <UserProfile />
          </div>

          {/* Registration History Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-nibog-primary">
              Registration History
            </h2>

            {loading ? (
              <div>Loading registrations...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : registrations.length === 0 ? (
              <div className="text-gray-500">
                No registrations found.
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map(reg => (
                  <div 
                    key={reg.id} 
                    className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <h3 className="text-xl font-semibold text-nibog-primary mb-2">
                      {reg.event.name}
                    </h3>
                    <div className="text-gray-600 space-y-1">
                      <p>
                        <strong>Date:</strong> {format(new Date(reg.event.date), 'PP')}
                      </p>
                      <p>
                        <strong>City:</strong> {reg.event.city.name}
                      </p>
                      <p>
                        <strong>Game:</strong> {reg.game.name}
                      </p>
                      <p>
                        <strong>Child:</strong> {reg.childName} (Age {reg.childAge})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
