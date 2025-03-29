import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: undefined 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
                <p className="text-red-700 font-medium">Error Details:</p>
                <pre className="text-xs text-red-600 overflow-x-auto">
                  {this.state.error.message || 'Unknown error'}
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

    return this.props.children;
  }
}

export default ErrorBoundary;
