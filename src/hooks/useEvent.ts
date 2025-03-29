import { useState, useEffect } from 'react'
import axios from 'axios'

export const useEvent = (eventId?: string) => {
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return

      try {
        setIsLoading(true)
        const response = await axios.get(`/api/events/${eventId}`)
        setEvent(response.data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch event details')
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  return { event, isLoading, error }
}
