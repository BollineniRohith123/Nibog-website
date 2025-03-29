import React from 'react'
import { NextPage, NextPageContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'

interface ErrorProps {
  statusCode?: number
  errorMessage?: string
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode, errorMessage }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Head>
        <title>{`${statusCode ? `${statusCode} - ` : ''}Error | NIBOG`}</title>
      </Head>
      
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          {statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong'}
        </h1>
        
        <p className="text-gray-700 mb-6">
          {statusCode === 404 
            ? "The page you're looking for doesn't exist." 
            : errorMessage || "An unexpected error occurred."}
        </p>
        
        {statusCode === 500 && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Debugging Information</h3>
            <pre className="text-xs text-red-600 overflow-x-auto">
              {errorMessage || 'No additional error details available.'}
            </pre>
          </div>
        )}
        
        <div className="flex justify-center space-x-4">
          <Link 
            href="/" 
            className="bg-nibog-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Return to Home
          </Link>
          
          {statusCode !== 404 && (
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
            >
              Reload Page
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  const errorMessage = err ? err.message : undefined

  // Log the error server-side
  if (err) {
    console.error('Unhandled Error:', err)
  }

  return { 
    statusCode,
    errorMessage: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : errorMessage 
  }
}

export default ErrorPage
