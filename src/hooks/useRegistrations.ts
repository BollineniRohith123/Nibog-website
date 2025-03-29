import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

// Safe logging function
function safeLog(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

// Interfaces for type safety
interface City {
  id: string
  name: string
}

interface Event {
  id: string
  name: string
  date: string
  city?: City | null
}

interface Registration {
  id: string
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED'
  event: Event
}

function useRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user, isLoaded } = useUser()

  useEffect(() => {
    const fetchRegistrations = async () => {
      // Check if user is not loaded or doesn't exist
      if (!isLoaded || !user) {
        safeLog('Fetch Registrations: No user or not loaded')
        setRegistrations([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await axios.get('/api/registrations', {
          headers: { 'Authorization': `Bearer ${user.id}` }
        })

        // Validate response data
        const fetchedRegistrations = response.data?.registrations || []
        const validRegistrations = fetchedRegistrations.filter((reg: any) => 
          reg && reg.id && reg.event && reg.event.id
        )

        safeLog('Fetched Registrations', {
          totalFetched: fetchedRegistrations.length,
          validRegistrations: validRegistrations.length
        })

        setRegistrations(validRegistrations)
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred while fetching registrations'
        
        safeLog('Fetch Registrations Error', {
          error: errorMessage,
          userExists: !!user
        })

        setError(errorMessage)
        setRegistrations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegistrations()
  }, [user, isLoaded])

  const cancelRegistration = async (registrationId: string) => {
    if (!user || !isLoaded) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await axios.delete(`/api/registrations/${registrationId}`, {
        headers: { 'Authorization': `Bearer ${user.id}` }
      })

      // Remove the cancelled registration from the list
      setRegistrations(prevRegistrations => 
        prevRegistrations.filter(reg => reg.id !== registrationId)
      )

      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while cancelling registration'
      
      safeLog('Cancel Registration Error', {
        error: errorMessage,
        registrationId
      })

      throw new Error(errorMessage)
    }
  }

  return {
    registrations,
    isLoading,
    error,
    cancelRegistration
  }
}

export default useRegistrations
