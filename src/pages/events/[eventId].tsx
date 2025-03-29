import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useEvent } from '../../hooks/useEvent'
import { useRegistration } from '../../hooks/useRegistration'
import { format } from 'date-fns'
import { SignedIn, useUser } from '@clerk/nextjs'

type AgeGroup = {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
}

const EventDetailPage: React.FC = () => {
  const router = useRouter()
  const { eventId } = router.query
  const { user } = useUser()

  const { event, isLoading: eventLoading, error: eventError } = useEvent(eventId as string)
  const { createRegistration, isLoading: registrationLoading } = useRegistration()

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<number | null>(null)

  const handleRegister = async () => {
    if (!selectedAgeGroup) {
      alert('Please select an age group')
      return
    }

    try {
      await createRegistration({
        eventId: event!.id,
        userId: user!.id,
        ageGroupId: selectedAgeGroup
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed', error)
      alert('Failed to register. Please try again.')
    }
  }

  if (eventLoading) return <Layout>Loading event details...</Layout>
  if (eventError) return <Layout>Error loading event: {eventError}</Layout>
  if (!event) return <Layout>Event not found</Layout>

  return (
    <Layout 
      title={`${event.name} - NIBOG Event`} 
      description={event.description}
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-8">
        {/* Event Details */}
        <div>
          <h1 className="text-3xl font-bold text-nibog-primary mb-4">
            {event.name}
          </h1>
          <p className="text-gray-600 mb-6">{event.description}</p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-nibog-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{format(new Date(event.date), 'PPPP')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-nibog-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.city.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-nibog-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>₹{event.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Game Details */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-xl font-semibold text-nibog-primary mb-3">
              {event.game.name}
            </h3>
            <p className="text-gray-600">{event.game.description}</p>
          </div>
        </div>

        {/* Registration Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-nibog-primary mb-6">
            Register for Event
          </h2>

          <SignedIn>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Select Age Group</label>
                <div className="grid grid-cols-2 gap-4">
                  {event.ageGroups.map((ageGroup: AgeGroup) => (
                    <button
                      key={ageGroup.id}
                      onClick={() => setSelectedAgeGroup(ageGroup.id)}
                      className={`
                        border-2 rounded-md p-3 text-center transition-colors
                        ${selectedAgeGroup === ageGroup.id 
                          ? 'border-nibog-primary bg-blue-50 text-nibog-primary' 
                          : 'border-gray-300 hover:border-nibog-primary'
                        }
                      `}
                    >
                      <div className="font-semibold">{ageGroup.name}</div>
                      <div className="text-sm text-gray-600">
                        {ageGroup.minAge} - {ageGroup.maxAge} months
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={!selectedAgeGroup || registrationLoading}
                className="w-full bg-nibog-primary text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {registrationLoading ? 'Processing...' : 'Register Now'}
              </button>
            </div>
          </SignedIn>
        </div>
      </div>
    </Layout>
  )
}

export default EventDetailPage
