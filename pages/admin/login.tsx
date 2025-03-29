import React, { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const { signIn } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn?.create({
        strategy: 'oauth_google',
        redirectUrl: '/admin/dashboard'
      });

      if (result?.status === 'complete') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn?.create({
        strategy: 'oauth_microsoft',
        redirectUrl: '/admin/dashboard'
      });

      if (result?.status === 'complete') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Microsoft Sign-in Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E68C] to-[#40E0D0] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Admin Login - NIBOG</title>
        <meta name="description" content="NIBOG Admin Portal Login" />
      </Head>

      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="NIBOG Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-[#008080]">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-[#8B8B83]">
            Sign in to manage NIBOG events and registrations
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            onClick={handleGoogleSignIn}
            className="group relative"
          >
            <span className="absolute left-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </span>
            Sign in with Google
          </Button>

          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={handleMicrosoftSignIn}
            className="group relative"
          >
            <span className="absolute left-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                />
              </svg>
            </span>
            Sign in with Microsoft
          </Button>
        </div>

        <div className="mt-6">
          <p className="text-center text-sm text-[#8B8B83]">
            By signing in, you agree to our{' '}
            <a href="#" className="font-medium text-[#008080] hover:text-[#006400]">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-[#008080] hover:text-[#006400]">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
