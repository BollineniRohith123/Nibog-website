import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useEvents } from '../../hooks/useEvents'
import Link from 'next/link'
import { format } from 'date-fns'
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa'

const EventsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [cityFilter, setCityFilter] = useState<number | null>(null)
  
  const { events, isLoading, error, cities } = useEvents(page, cityFilter)

  return (
    <Layout 
      title="NIBOG Events" 
      description="Browse upcoming baby and toddler events"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-nibog-teal mb-6">
            Upcoming Events
          </h1>
          
          {/* City Filter */}
          <div className="flex items-center space-x-4 mb-8">
            <label className="text-nibog-gray font-medium">Filter by City:</label>
            <select 
              value={cityFilter || ''}
              onChange={(e) => setCityFilter(e.target.value ? Number(e.target.value) : null)}
              className="input-field"
            >
              <option value="">All Cities</option>
              {cities?.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Loading & Error States */}
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-nibog-gray">Loading events...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Events Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {events?.map(event => (
              <div 
                key={event.id} 
                className="card overflow-hidden hover:scale-105 transform transition-all"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-nibog-teal mb-4">
                    {event.name}
                  </h2>
                  <p className="text-nibog-gray mb-6">{event.description}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <FaCalendar className="text-nibog-teal" />
                      <span>{format(new Date(event.date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="text-nibog-teal" />
                      <span>{event.city.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaTicketAlt className="text-nibog-green" />
                      <span className="text-lg font-semibold">
                        ₹{event.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link 
                    href={`/events/${event.id}`} 
                    className="btn-primary w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {events && events.length > 0 && (
            <div className="flex justify-center mt-12 space-x-4">
              <button 
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-nibog-gray">Page {page}</span>
              <button 
                onClick={() => setPage(prev => prev + 1)}
                disabled={!events || events.length === 0}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default EventsPage
