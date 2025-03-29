import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useUser } from '@clerk/nextjs';
import { prisma } from '../../lib/db';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationsCount: number;
  lastRegistrationDate?: string;
  upcomingEvents: Array<{
    id: string;
    eventName: string;
    registrationDate: string;
  }>;
}

interface UsersPageProps {
  initialUsers: UserProfile[];
}

const EventUsersPage: React.FC<UsersPageProps> = ({ initialUsers }) => {
  const { user: currentUser, isLoaded } = useUser();
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [filters, setFilters] = useState({
    searchTerm: '',
    minRegistrations: 0,
    sortBy: 'registrationsCount'
  });

  const filteredUsers = users
    .filter(user => 
      user.firstName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase())
    )
    .filter(user => user.registrationsCount >= filters.minRegistrations)
    .sort((a, b) => {
      switch(filters.sortBy) {
        case 'registrationsCount':
          return b.registrationsCount - a.registrationsCount;
        case 'lastName':
          return a.lastName.localeCompare(b.lastName);
        default:
          return 0;
      }
    });

  if (!isLoaded) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in to view users</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Event Participants</h1>
      
      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Search Participants</label>
          <input 
            type="text"
            placeholder="Search by name or email"
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Min Registrations</label>
          <input 
            type="number"
            value={filters.minRegistrations}
            onChange={(e) => setFilters(prev => ({...prev, minRegistrations: Number(e.target.value)}))}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-2">Sort By</label>
          <select 
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value}))}
            className="w-full p-2 border rounded"
          >
            <option value="registrationsCount">Registrations Count</option>
            <option value="lastName">Last Name</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-600">No participants found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredUsers.map(participant => (
            <div 
              key={participant.id} 
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {participant.firstName} {participant.lastName}
                  </h2>
                  <p className="text-gray-600 text-sm">{participant.email}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="font-medium">
                  Total Registrations: {participant.registrationsCount}
                </p>
                {participant.lastRegistrationDate && (
                  <p className="text-sm text-gray-500">
                    Last Registration: {new Date(participant.lastRegistrationDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {participant.upcomingEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Upcoming Events:</h3>
                  <ul className="list-disc list-inside text-sm">
                    {participant.upcomingEvents.map(event => (
                      <li key={event.id}>
                        {event.eventName} 
                        <span className="text-gray-500 ml-2">
                          (Registered: {new Date(event.registrationDate).toLocaleDateString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        registrations: {
          include: {
            event: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { registrations: true }
        }
      }
    });

    const initialUsers: UserProfile[] = users.map((user: any) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName || '',
      email: user.email,
      registrationsCount: user._count.registrations,
      lastRegistrationDate: user.registrations[0]?.createdAt.toISOString(),
      upcomingEvents: user.registrations.map((reg: any) => ({
        id: reg.event.id.toString(),
        eventName: reg.event.name,
        registrationDate: reg.createdAt.toISOString()
      }))
    }));

    return {
      props: {
        initialUsers: JSON.parse(JSON.stringify(initialUsers)),
      },
    };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return {
      props: {
        initialUsers: [],
      },
    };
  }
};

export default EventUsersPage;
