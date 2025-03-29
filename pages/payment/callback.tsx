import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { withAdminAuth } from '../../utils/adminAuth';

function PaymentCallback() {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failure'>('loading');
  const [registrationId, setRegistrationId] = useState<number | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Extract payment details from query parameters
        const { merchantTransactionId, transactionId, status } = router.query;

        if (!merchantTransactionId || !transactionId || !status) {
          setPaymentStatus('failure');
          return;
        }

        const response = await fetch('/api/payment/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            merchantTransactionId,
            transactionId,
            status
          })
        });

        const result = await response.json();

        if (response.ok) {
          setPaymentStatus('success');
          setRegistrationId(result.registrationId);
        } else {
          setPaymentStatus('failure');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failure');
      }
    }

    if (router.isReady) {
      verifyPayment();
    }
  }, [router.isReady, router.query]);

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            <p className="mt-4 text-lg text-gray-700">Verifying payment...</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
            <CheckCircleIcon className="h-24 w-24 text-green-500" />
            <h1 className="text-3xl font-bold text-green-700 mt-4">Payment Successful!</h1>
            <p className="mt-2 text-green-600">
              Your registration (ID: {registrationId}) has been confirmed.
            </p>
            <div className="mt-6 flex space-x-4">
              <button 
                onClick={() => router.push('/registrations')}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                View Registrations
              </button>
              <button 
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      case 'failure':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
            <XCircleIcon className="h-24 w-24 text-red-500" />
            <h1 className="text-3xl font-bold text-red-700 mt-4">Payment Failed</h1>
            <p className="mt-2 text-red-600">
              There was an issue processing your payment. Please try again.
            </p>
            <div className="mt-6 flex space-x-4">
              <button 
                onClick={() => router.push('/registrations/new')}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Retry Registration
              </button>
              <button 
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
    }
  };

  return renderPaymentStatus();
}

export default withAdminAuth(PaymentCallback);
