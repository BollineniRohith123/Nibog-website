import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useUser } from '@clerk/nextjs';
import { prisma } from '../../lib/db';
import { formatCurrency } from '../../lib/helpers';

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  eventName: string;
  registrationId: string;
  createdAt: string;
  paymentMethod?: string;
}

interface PaymentsPageProps {
  initialPayments: Payment[];
}

const EventPaymentsPage: React.FC<PaymentsPageProps> = ({ initialPayments }) => {
  const { user: currentUser, isLoaded } = useUser();
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [filters, setFilters] = useState({
    status: 'ALL',
    minAmount: 0,
    sortBy: 'createdAt'
  });

  const filteredPayments = payments
    .filter(payment => 
      filters.status === 'ALL' || payment.status === filters.status
    )
    .filter(payment => payment.amount >= filters.minAmount)
    .sort((a, b) => {
      switch(filters.sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (!isLoaded) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in to view payments</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      
      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Payment Status</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
            className="w-full p-2 border rounded"
          >
            <option value="ALL">All Payments</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2">Minimum Amount</label>
          <input 
            type="number"
            value={filters.minAmount}
            onChange={(e) => setFilters(prev => ({...prev, minAmount: Number(e.target.value)}))}
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
            <option value="createdAt">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <p className="text-center text-gray-600">No payments found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredPayments.map((payment: Payment) => (
            <div 
              key={payment.id} 
              className={`
                border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow
                ${payment.status === 'COMPLETED' ? 'border-green-500' : 
                  payment.status === 'PENDING' ? 'border-yellow-500' : 'border-red-500'}
              `}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{payment.eventName}</h2>
                <span 
                  className={`
                    px-2 py-1 rounded text-xs font-bold
                    ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                  `}
                >
                  {payment.status}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(payment.amount)}
                </p>
                {payment.paymentMethod && (
                  <p className="text-sm text-gray-600">
                    Payment Method: {payment.paymentMethod}
                  </p>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Registration ID: {payment.registrationId}</p>
                <p>
                  Date: {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
              
              {payment.status === 'FAILED' && (
                <button 
                  className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  onClick={() => {/* Retry payment logic */}}
                >
                  Retry Payment
                </button>
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
    const payments = await prisma.paymentTransaction.findMany({
      include: {
        registration: {
          select: {
            id: true,
            event: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const initialPayments: Payment[] = payments.map((payment: any) => ({
      id: payment.id.toString(),
      amount: payment.amount,
      status: payment.status as 'PENDING' | 'COMPLETED' | 'FAILED',
      eventName: payment.registration.event.name,
      registrationId: payment.registration.id.toString(),
      createdAt: payment.createdAt.toISOString(),
      paymentMethod: payment.paymentMethod || undefined
    }));

    return {
      props: {
        initialPayments: JSON.parse(JSON.stringify(initialPayments)),
      },
    };
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return {
      props: {
        initialPayments: [],
      },
    };
  }
};

export default EventPaymentsPage;
