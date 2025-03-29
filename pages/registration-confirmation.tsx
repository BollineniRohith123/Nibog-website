import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const RegistrationConfirmationPage: React.FC = () => {
  const { user } = useUser();

  return (
    <Layout title="Registration Confirmation">
      <div className="container mx-auto px-4 max-w-lg text-center">
        <div className="bg-white shadow-md rounded-lg p-8 mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-20 w-20 mx-auto mb-4 text-green-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>

          <h1 className="text-3xl font-bold mb-4 text-nibog-primary">
            Registration Successful!
          </h1>

          <p className="text-gray-700 mb-4">
            Hi {user?.fullName || 'Parent'}, your child's registration is complete. 
            You will receive a confirmation email with all the details shortly.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">
              <strong>Next Steps:</strong> 
              Please check your email for payment instructions and event details.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Link href="/events" className="bg-nibog-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition">
              Browse More Events
            </Link>

            <Link href="/account" className="bg-nibog-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition">
              View My Registrations
            </Link>
          </div>
        </div>

        <div className="text-gray-600">
          <p>Need help? Contact our support team at support@nibog.com</p>
        </div>
      </div>
    </Layout>
  );
};

export default RegistrationConfirmationPage;
