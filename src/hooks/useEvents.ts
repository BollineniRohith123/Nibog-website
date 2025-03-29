import { useState, useEffect } from 'react'
import axios from 'axios'

export const useEvents = (page = 1, cityId?: number | null) => {
  const [events, setEvents] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        params.append('page', page.toString())
        if (cityId) params.append('cityId', cityId.toString())

        const [eventsResponse, citiesResponse] = await Promise.all([
          axios.get(`/api/events?${params.toString()}`),
          axios.get('/api/cities')
        ])

        setEvents(eventsResponse.data)
        setCities(citiesResponse.data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch events')
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [page, cityId])

  return { events, cities, isLoading, error }
}
