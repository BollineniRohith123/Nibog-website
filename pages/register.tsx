import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import RegistrationForm from '../components/RegistrationForm';

const RegisterPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) {
    router.push('/auth/sign-in');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Register for an Event</h1>
      <RegistrationForm eventId={router.query.eventId as string} />
    </div>
  );
};

export default RegisterPage;
