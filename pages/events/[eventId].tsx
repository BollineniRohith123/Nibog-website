import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Layout from '../../components/Layout';
import { prisma } from '../../lib/db';
import { format } from 'date-fns';
import Image from 'next/image';

// Unsplash image URLs for events
const unsplashImages = [
  'https://source.unsplash.com/random/800x600/?baby,sports',
  'https://source.unsplash.com/random/800x600/?toddler,play',
  'https://source.unsplash.com/random/800x600/?child,activity',
  'https://source.unsplash.com/random/800x600/?kids,games',
  'https://source.unsplash.com/random/800x600/?children,fun',
  'https://source.unsplash.com/random/800x600/?infant,event',
  'https://source.unsplash.com/random/800x600/?baby,event',
  'https://source.unsplash.com/random/800x600/?toddler,event',
  'https://source.unsplash.com/random/800x600/?child,event',
];

// Get an image for an event
const getEventImage = (eventId: number) => {
  return unsplashImages[eventId % unsplashImages.length];
};

interface Game {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
}

interface City {
  id: number;
  name: string;
}

interface EventDetailProps {
  event: {
    id: number;
    name: string;
    date: string;
    time: string;
    description?: string;
    maxCapacity: number;
    price: number;
    city: City;
    games: Game[];
  };
}

const EventDetailPage: React.FC<EventDetailProps> = ({ event }) => {
  const router = useRouter();

  const handleRegister = () => {
    router.push(`/events/${event.id}/register`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Event Details Section */}
          <div>
            <h1 className="text-3xl font-bold mb-4 text-nibog-primary">
              {event.name}
            </h1>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="mb-4">
                <p className="text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nibog-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {format(new Date(event.date), 'MMMM dd, yyyy')}
                </p>
                <p className="text-gray-600 flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nibog-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {event.time}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2 text-nibog-primary">Description</h3>
                <p className="text-gray-700">
                  {event.description || 'No description available'}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2 text-nibog-primary">Location</h3>
                <p className="text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-nibog-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {event.city.name}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2 text-nibog-primary">Games</h3>
                <div className="space-y-2">
                  {event.games.map(game => (
                    <div 
                      key={game.id} 
                      className="bg-gray-100 p-3 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-semibold">{game.name}</h4>
                        <p className="text-sm text-gray-600">
                          Age Range: {game.minAge} - {game.maxAge} years
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-xl font-bold text-nibog-primary">
                  ₹{event.price}
                </p>
                <SignedIn>
                  <button 
                    onClick={handleRegister}
                    className="bg-nibog-primary text-white px-6 py-2 rounded-lg hover:bg-nibog-secondary transition"
                  >
                    Register Now
                  </button>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-nibog-primary text-white px-6 py-2 rounded-lg hover:bg-nibog-secondary transition">
                      Sign In to Register
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>

          {/* Event Image Section */}
          <div className="md:block">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
              <div className="relative h-96 w-full">
                <Image 
                  src={getEventImage(event.id)}
                  alt={event.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-nibog-primary">Event Details</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nibog-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Duration: 2 hours</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nibog-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-gray-700">Capacity: {event.maxCapacity}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-nibog-primary mb-2">What to Expect</h4>
                  <p className="text-gray-700 text-sm">
                    Join us for an exciting event designed specifically for young children. 
                    Our experienced staff will ensure a safe and fun environment for all participants.
                    Don't miss this opportunity to create lasting memories!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  if (!id) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      event: await prisma.event.findUnique({
        where: { id: Number(id) },
        include: {
          city: true,
          game: true
        }
      })
    }
  };
};

export default EventDetailPage;