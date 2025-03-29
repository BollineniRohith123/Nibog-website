import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useRegistrations from '../hooks/useRegistrations'
import { useUser, SignedIn } from '@clerk/nextjs'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa'

// Extremely safe logging function
const safeLog = (...args: any[]) => {
  try {
    // Use JSON.stringify with a replacer to handle circular references and undefined
    const safeStringify = (obj: any) => {
      const seen = new WeakSet()
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]'
          seen.add(value)
        }
        // Convert undefined to null
        return value === undefined ? null : value
      }, 2)
    }

    // Log each argument safely
    const safeArgs = args.map(arg => 
      typeof arg === 'object' && arg !== null 
        ? safeStringify(arg) 
        : String(arg)
    )

    console.log(...safeArgs)
  } catch (err) {
    // Fallback to basic logging if stringify fails
    console.error('Logging failed:', err)
    try {
      console.log(...args)
    } catch {}
  }
}

const DashboardPage: React.FC = () => {
  const router = useRouter()
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser()
  const { 
    registrations = [], 
    isLoading, 
    error, 
    cancelRegistration 
  } = useRegistrations()
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)

  // Minimal, safe logging
  useEffect(() => {
    safeLog('Dashboard Page - User State', {
      userExists: user !== null && user !== undefined,
      isUserLoaded,
      isSignedIn,
      registrationsCount: registrations.length,
      isLoading
    })
  }, [user, isUserLoaded, isSignedIn, registrations, isLoading])

  // If authentication or registrations are still loading, show a loading state
  const isPageLoading = !isUserLoaded || isLoading

  // If not signed in, redirect to sign-in
  useEffect(() => {
    if (isUserLoaded && !isSignedIn) {
      router.replace('/sign-in')
    }
  }, [isUserLoaded, isSignedIn, router])

  // If page is still loading, show loading indicator
  if (isPageLoading) {
    return (
      <Layout 
        title="Loading Dashboard" 
        description="Loading user dashboard"
      >
        <div className="flex justify-center items-center h-screen bg-nibog-pale-yellow">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 mx-auto mb-4 border-4 border-t-4 border-nibog-teal rounded-full"></div>
            <p className="text-nibog-teal font-semibold">Loading Dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Status color and icon mapping
  const getStatusStyles = (status: string = 'UNKNOWN') => {
    switch(status) {
      case 'CONFIRMED': return {
        color: 'text-nibog-green',
        bgColor: 'bg-green-50',
        icon: <FaCheckCircle className="text-nibog-green" />
      }
      case 'PENDING': return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: <FaClock className="text-yellow-600" />
      }
      case 'CANCELLED': return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: <FaTimesCircle className="text-red-600" />
      }
      default: return {
        color: 'text-nibog-gray',
        bgColor: 'bg-gray-50',
        icon: <FaInfoCircle className="text-nibog-gray" />
      }
    }
  }

  const handleCancelRegistration = async (registrationId: string) => {
    if (!registrationId) {
      safeLog('Attempted to cancel registration with invalid ID')
      return
    }

    setSelectedRegistration(registrationId)
    setCancelError(null)
    try {
      await cancelRegistration(registrationId)
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while cancelling registration'
      
      safeLog('Registration Cancellation Error', {
        registrationId,
        error: errorMessage
      })
      
      setCancelError(errorMessage)
    } finally {
      setSelectedRegistration(null)
    }
  }

  return (
    <SignedIn>
      <Layout 
        title="My Dashboard" 
        description="View and manage your NIBOG event registrations"
      >
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-nibog-teal mb-4">
                Welcome, {user?.firstName || 'Parent'}
              </h1>
              <p className="text-nibog-gray">Manage your event registrations</p>
            </div>
            <Link 
              href="/events" 
              className="btn-secondary hidden md:inline-flex"
            >
              Browse Events
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-3 mb-6">
              <FaExclamationTriangle className="text-2xl" />
              <span>{error}</span>
            </div>
          )}

          {cancelError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-3 mb-6">
              <FaExclamationTriangle className="text-2xl" />
              <span>{cancelError}</span>
            </div>
          )}

          {registrations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-nibog-gray mb-6 text-xl">
                You haven't registered for any events yet.
              </p>
              <Link 
                href="/events" 
                className="btn-primary"
              >
                Browse Events
              </Link>
            </div>
          )}

          {registrations.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-semibold text-nibog-teal mb-6">
                My Registrations
              </h2>

              {registrations.map(registration => {
                // Ensure registration and event are not null
                if (!registration || !registration.event) {
                  safeLog('Invalid registration data', registration)
                  return null
                }

                const statusStyles = getStatusStyles(registration.status)
                return (
                  <div 
                    key={registration.id || 'unknown-registration'} 
                    className={`card p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 ${statusStyles.bgColor}`}
                  >
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-nibog-teal mb-4">
                        {registration.event.name || 'Unnamed Event'}
                      </h3>
                      <div className="space-y-3 text-nibog-gray">
                        <div className="flex items-center space-x-3">
                          <FaCalendar className="text-nibog-teal" />
                          <span>
                            {registration.event.date 
                              ? format(new Date(registration.event.date), 'PPP') 
                              : 'Date Not Available'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaMapMarkerAlt className="text-nibog-teal" />
                          <span>
                            {registration.event.city?.name || 'Location Not Specified'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="mr-2">
                            {statusStyles.icon}
                          </div>
                          <span className={`font-semibold ${statusStyles.color}`}>
                            {registration.status || 'Unknown Status'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                      <Link 
                        href={`/events/${registration.event.id || 'unknown'}`} 
                        className="btn-secondary w-full md:w-auto text-center"
                      >
                        View Event
                      </Link>
                      {registration.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => handleCancelRegistration(registration.id)}
                          disabled={selectedRegistration === registration.id}
                          className={`
                            btn-primary 
                            w-full md:w-auto 
                            bg-red-500 
                            hover:bg-red-600 
                            ${selectedRegistration === registration.id ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {selectedRegistration === registration.id ? 'Cancelling...' : 'Cancel Registration'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              }).filter(Boolean) /* Remove any null entries */}
            </div>
          )}
        </div>
      </Layout>
    </SignedIn>
  )
}

export default DashboardPage
