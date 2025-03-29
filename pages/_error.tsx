import { NextPageContext } from 'next';
import React from 'react';

interface ErrorProps {
  statusCode?: number;
  err?: Error;
}

function Error({ statusCode, err }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {statusCode 
            ? `Error ${statusCode}` 
            : 'An Unexpected Error Occurred'}
        </h1>
        {err && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
            <p className="text-red-700 font-medium">Error Details:</p>
            <pre className="text-xs text-red-600 overflow-x-auto">
              {err.message || 'Unknown error'}
            </pre>
          </div>
        )}
        <p className="text-gray-600 mb-4">
          We apologize for the inconvenience. Please try again or contact support.
        </p>
        <div className="flex space-x-4">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Reload Page
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { 
    statusCode,
    err: err || undefined 
  };
};

export default Error;
