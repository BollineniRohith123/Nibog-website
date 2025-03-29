import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { withAdminAuth } from '../../utils/adminAuth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { formatDate } from '@/utils/dateUtils';

const prisma = new PrismaClient();

function RegistrationsPage() {
  const { user } = useUser();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const response = await fetch('/api/registrations');
        if (!response.ok) {
          throw new Error('Failed to fetch registrations');
        }
        const data = await response.json();
        setRegistrations(data);
        setIsLoading(false);
      } catch (err) {
        setError(typeof err === 'object' && err !== null && 'message' in err 
          ? (err as Error).message 
          : String(err));
        setIsLoading(false);
      }
    }

    if (user) {
      fetchRegistrations();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Registrations</h1>
      
      {registrations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You have no registrations yet.</p>
          <Link 
            href="/registrations/new" 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Register for an Event
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {registrations.map((registration) => (
            <div 
              key={registration.id} 
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2">
                {registration.child.name}
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Event:</strong> {registration.event.name}
                </p>
                <p>
                  <strong>Game:</strong> {registration.game.name}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(registration.event.date)}
                </p>
                <p>
                  <strong>Payment Status:</strong> 
                  <span 
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      registration.paymentStatus === 'PAID' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {registration.paymentStatus}
                  </span>
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link 
                  href={`/registrations/${registration.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
                {registration.paymentStatus !== 'PAID' && (
                  <Link 
                    href={`/payment/${registration.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
                  >
                    Complete Payment
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAdminAuth(RegistrationsPage);
