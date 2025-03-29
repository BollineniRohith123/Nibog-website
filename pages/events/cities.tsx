import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { prisma } from '../../lib/db';

interface City {
  id: number;
  name: string;
  state?: string;
  eventCount: number;
  upcomingEvents: Array<{
    id: number;
    name: string;
    startDate: string;
  }>;
}

interface CitiesPageProps {
  initialCities: City[];
}

const EventCitiesPage: React.FC<CitiesPageProps> = ({ initialCities }) => {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');

  const states = ['ALL', ...Array.from(new Set(cities.map(city => city.state)))];

  const filteredCities = cities.filter(city => 
    (selectedState === 'ALL' || city.state === selectedState) &&
    (city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     city.state?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Event Cities</h1>
      
      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Search City/State</label>
          <input 
            type="text"
            placeholder="Search cities or states"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Filter by State</label>
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredCities.length === 0 ? (
        <p className="text-center text-gray-600">No cities found matching your criteria.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCities.map((city: City) => (
            <div 
              key={city.id} 
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{city.name}</h2>
              <p className="text-gray-600 mb-2">State: {city.state}</p>
              
              <div className="mb-4">
                <p className="font-medium">Upcoming Events: {city.eventCount}</p>
                {city.upcomingEvents.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold mb-1">Upcoming Events:</h3>
                    <ul className="list-disc list-inside text-sm">
                      {city.upcomingEvents.map((event: { id: number; name: string; startDate: string }) => (
                        <li key={event.id}>
                          <Link 
                            href={`/events/${event.id}`} 
                            className="text-blue-500 hover:underline"
                          >
                            {event.name} ({new Date(event.startDate).toLocaleDateString()})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <Link 
                href={`/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="w-full block text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                View City Events
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: { events: true }
        },
        events: {
          take: 3,
          orderBy: { startDate: 'asc' },
          select: { id: true, name: true, startDate: true }
        }
      }
    });

    const initialCities: City[] = cities.map((city: any) => ({
      id: city.id,
      name: city.name,
      state: city.name.split(',').length > 1 ? city.name.split(',')[1].trim() : 'Unknown',
      eventCount: city._count.events,
      upcomingEvents: city.events.map((event: any) => ({
        id: event.id,
        name: event.name,
        startDate: event.startDate.toISOString()
      }))
    }));

    return {
      props: {
        initialCities: JSON.parse(JSON.stringify(initialCities)),
      },
    };
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return {
      props: {
        initialCities: [],
      },
    };
  }
};

export default EventCitiesPage;
