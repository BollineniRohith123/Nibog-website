import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

interface RegistrationFormProps {
  eventId: string;
}

interface RegistrationData {
  childName: string;
  parentName: string;
  email: string;
  phone: string;
  age: number;
  gameId?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ eventId }) => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationData>();

  const onSubmit = async (data: RegistrationData) => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, eventId })
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/registrations/${result.id}`);
      } else {
        // Handle error
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-2">Child Name</label>
        <input 
          {...register('childName', { required: 'Child name is required' })}
          className="w-full p-2 border rounded"
        />
        {errors.childName && <p className="text-red-500">{errors.childName.message}</p>}
      </div>
      
      {/* Add more form fields as needed */}
      
      <button 
        type="submit" 
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
