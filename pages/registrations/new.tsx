import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { withAdminAuth } from '../../utils/adminAuth';
import { PrismaClient } from '@prisma/client';
import PaymentService from '@/services/payment';

const prisma = new PrismaClient();

function NewRegistrationPage() {
  const router = useRouter();
  const { user } = useUser();

  const [events, setEvents] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [parentName, setParentName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventsAndGames() {
      try {
        const [eventsResponse, gamesResponse] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/games')
        ]);

        const eventsData = await eventsResponse.json();
        const gamesData = await gamesResponse.json();

        setEvents(eventsData);
        setGames(gamesData);
      } catch (err) {
        setError(typeof err === 'object' && err !== null && 'message' in err 
          ? (err as Error).message 
          : 'Failed to load events and games');
      }
    }

    if (user) {
      fetchEventsAndGames();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate user
    if (!user) {
      setError('Please log in to register');
      setIsLoading(false);
      return;
    }

    // Validate form fields
    if (!selectedEvent || !selectedGame || !childName || !parentName || !contactInfo) {
      setError('Please fill out all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childName,
          childAge: parseInt(childAge),
          gameId: selectedGame,
          eventId: selectedEvent,
          parentName,
          contactInfo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Initiate payment
      const paymentUrl = await PaymentService.initiatePayment({
        registrationId: data.id,
        amount: data.totalAmount,
        customerName: parentName,
        customerEmail: user?.emailAddresses?.[0]?.emailAddress || '',
        customerPhone: contactInfo
      });

      // Redirect to payment
      window.location.href = paymentUrl;
    } catch (err) {
      setError(typeof err === 'object' && err !== null && 'message' in err 
        ? (err as Error).message 
        : 'Registration failed');
      setIsLoading(false);
    }
  };

  const filteredGames = games.filter(game => 
    selectedEvent 
      ? game.eventId === selectedEvent 
      : true
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">New Registration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="childName" className="block mb-2">
            Child's Name
          </label>
          <input 
            type="text" 
            id="childName"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required 
          />
        </div>

        <div>
          <label htmlFor="childAge" className="block mb-2">
            Child's Age
          </label>
          <input 
            type="number" 
            id="childAge"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            min="1"
            max="10"
            required 
          />
        </div>

        <div>
          <label htmlFor="event" className="block mb-2">
            Select Event
          </label>
          <select 
            id="event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select an Event</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} - {event.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="game" className="block mb-2">
            Select Game
          </label>
          <select 
            id="game"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
            disabled={!selectedEvent}
          >
            <option value="">
              {selectedEvent ? 'Select a Game' : 'First select an Event'}
            </option>
            {filteredGames.map(game => (
              <option key={game.id} value={game.id}>
                {game.name} (Ages {game.minAge}-{game.maxAge})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="parentName" className="block mb-2">
            Parent's Name
          </label>
          <input 
            type="text" 
            id="parentName"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required 
          />
        </div>

        <div>
          <label htmlFor="contactInfo" className="block mb-2">
            Contact Number
          </label>
          <input 
            type="tel" 
            id="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            pattern="[0-9]{10}"
            required 
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
}

export default withAdminAuth(NewRegistrationPage);
