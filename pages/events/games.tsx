import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/db';

interface Game {
  id: string;
  name: string;
  description: string;
  minAge: number;
  maxAge: number;
  category: string;
  maxParticipants: number;
  availableSlots: number;
}

interface GamesPageProps {
  initialGames: Game[];
}

const EventGamesPage: React.FC<GamesPageProps> = ({ initialGames }) => {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [filters, setFilters] = useState({
    category: 'ALL',
    minAge: 0,
    maxAge: 100
  });

  const filteredGames = games.filter(game => 
    (filters.category === 'ALL' || game.category === filters.category) &&
    game.minAge >= filters.minAge &&
    game.maxAge <= filters.maxAge
  );

  const categories = ['ALL', ...Array.from(new Set(games.map(game => game.category)))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Games</h1>
      
      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Category</label>
          <select 
            value={filters.category}
            onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
            className="w-full p-2 border rounded"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-2">Min Age</label>
          <input 
            type="number"
            value={filters.minAge}
            onChange={(e) => setFilters(prev => ({...prev, minAge: Number(e.target.value)}))}
            className="w-full p-2 border rounded"
            min="0"
            max="100"
          />
        </div>
        
        <div>
          <label className="block mb-2">Max Age</label>
          <input 
            type="number"
            value={filters.maxAge}
            onChange={(e) => setFilters(prev => ({...prev, maxAge: Number(e.target.value)}))}
            className="w-full p-2 border rounded"
            min="0"
            max="100"
          />
        </div>
      </div>

      {filteredGames.length === 0 ? (
        <p className="text-center text-gray-600">No games found matching your criteria.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredGames.map((game: Game) => (
            <div 
              key={game.id} 
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              
              <div className="space-y-2">
                <p>
                  <strong>Age Range:</strong> {game.minAge} - {game.maxAge} years
                </p>
                <p>
                  <strong>Category:</strong> {game.category}
                </p>
                <p>
                  <strong>Available Slots:</strong> {game.availableSlots}
                </p>
              </div>
              
              <button 
                disabled={game.availableSlots === 0}
                className={`
                  w-full mt-4 py-2 rounded
                  ${game.availableSlots > 0 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                `}
              >
                {game.availableSlots > 0 ? 'Register' : 'No Slots Available'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        minAge: true,
        maxAge: true,
        skillLevel: true,
        maxParticipants: true
      }
    });

    const initialGames: Game[] = games.map((game: any) => ({
      ...game,
      category: game.skillLevel || 'Unspecified',
      availableSlots: game.maxParticipants
    }));

    return {
      props: {
        initialGames: JSON.parse(JSON.stringify(initialGames)),
      },
    };
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return {
      props: {
        initialGames: [],
      },
    };
  }
};

export default EventGamesPage;
