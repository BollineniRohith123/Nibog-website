import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Layout from '../../../components/Layout';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';

interface Event {
  id: number;
  name: string;
  games: Game[];
}

interface Game {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
}

const EventRegistrationPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const { eventId } = router.query;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    gameId: '',
    parentName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [eligibleGames, setEligibleGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;

      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event details');

        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (err) {
        setError('Unable to load event details');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    const age = parseInt(formData.childAge);
    if (event && !isNaN(age)) {
      const games = event.games.filter(
        game => age >= game.minAge && age <= game.maxAge
      );
      setEligibleGames(games);
    }
  }, [formData.childAge, event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eventId: Number(eventId),
          userId: user?.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      router.push('/events/registrations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-nibog-primary">
          Register for {event.name}
        </h1>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block mb-2">Child Name</label>
            <input
              type="text"
              name="childName"
              value={formData.childName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Child Age</label>
            <input
              type="number"
              name="childAge"
              value={formData.childAge}
              onChange={handleInputChange}
              min="1"
              max="10"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Select Game</label>
            <select
              name="gameId"
              value={formData.gameId}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
              disabled={eligibleGames.length === 0}
            >
              <option value="">
                {eligibleGames.length === 0 
                  ? 'No games available for this age' 
                  : 'Select a game'}
              </option>
              {eligibleGames.map(game => (
                <option key={game.id} value={game.id}>
                  {game.name} (Age {game.minAge}-{game.maxAge})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Parent Name</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Contact Phone</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-nibog-primary text-white p-2 rounded hover:bg-opacity-90"
            disabled={eligibleGames.length === 0}
          >
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { eventId } = context.params || {};
  if (!eventId) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      event: await prisma.event.findUnique({
        where: { id: Number(eventId) },
        include: {
          game: true
        }
      })
    }
  };
};

export default EventRegistrationPage;
