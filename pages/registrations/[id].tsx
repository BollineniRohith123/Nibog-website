import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { withAdminAuth } from '../../utils/adminAuth';
import { formatDate } from '@/utils/dateUtils';
import QRCode from 'qrcode.react';
import Link from 'next/link';

function RegistrationDetailsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { id } = router.query;

  const [registration, setRegistration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegistrationDetails() {
      if (!id || !user) return;

      try {
        const response = await fetch(`/api/registrations/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch registration details');
        }
        const data = await response.json();
        setRegistration(data);
        setIsLoading(false);
      } catch (err) {
        setError(typeof err === 'object' && err !== null && 'message' in err 
          ? (err as Error).message 
          : String(err));
        setIsLoading(false);
      }
    }

    fetchRegistrationDetails();
  }, [id, user]);

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

  if (!registration) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-6">
          <h1 className="text-2xl font-bold">Registration Details</h1>
          <p className="text-blue-100">Registration ID: {registration.id}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Child Information</h2>
              <p><strong>Name:</strong> {registration.child.name}</p>
              <p><strong>Age:</strong> {registration.child.age} years</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Parent Information</h2>
              <p><strong>Name:</strong> {registration.parentName}</p>
              <p><strong>Contact:</strong> {registration.contactInfo}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Event Details</h2>
              <p><strong>Event:</strong> {registration.event.name}</p>
              <p><strong>City:</strong> {registration.event.city}</p>
              <p><strong>Date:</strong> {formatDate(registration.event.date)}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Game Details</h2>
              <p><strong>Game:</strong> {registration.game.name}</p>
              <p><strong>Age Range:</strong> {registration.game.minAge}-{registration.game.maxAge} years</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Payment Status</h2>
            <div 
              className={`px-4 py-2 rounded-md inline-block ${
                registration.paymentStatus === 'PAID' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {registration.paymentStatus}
            </div>
            {registration.paymentStatus !== 'PAID' && (
              <Link 
                href={`/payment/${registration.id}`}
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Complete Payment
              </Link>
            )}
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Registration QR Code</h2>
            <div className="flex justify-center">
              <QRCode 
                value={JSON.stringify({
                  registrationId: registration.id,
                  childName: registration.child.name,
                  eventName: registration.event.name,
                  gameName: registration.game.name
                })}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="mt-4 text-gray-600">
              Show this QR code at the event registration desk
            </p>
          </div>
        </div>

        <div className="bg-gray-100 p-6 flex justify-between">
          <Link 
            href="/registrations"
            className="text-blue-500 hover:underline"
          >
            Back to Registrations
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Print Registration
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(RegistrationDetailsPage);
