import { useRouter } from 'next/router';
import Head from 'next/head';
import { SignOutButton } from '@clerk/nextjs';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <Head>
        <title>Unauthorized Access | Nibog Events</title>
      </Head>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to access the admin dashboard. 
          Only users with an admin role or @nibog.com email domain can access this area.
        </p>
        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => router.push('/')} 
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
          <SignOutButton>
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
