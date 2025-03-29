import { useState } from 'react'
import axios from 'axios'

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRegistration = async (registrationData: {
    eventId: number
    userId: string
    ageGroupId: number
  }) => {
    try {
      setIsLoading(true)
      const response = await axios.post('/api/registrations', registrationData)
      setIsLoading(false)
      return response.data
    } catch (err) {
      setError('Failed to create registration')
      setIsLoading(false)
      throw err
    }
  }

  return { createRegistration, isLoading, error }
}
