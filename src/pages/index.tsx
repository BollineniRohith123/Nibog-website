import React from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Image from 'next/image'

const HomePage: React.FC = () => {
  return (
    <Layout 
      title="NIBOG - Baby Olympics Event Booking" 
      description="Register for exciting baby and toddler events across India"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Text Section */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-nibog-teal mb-6 leading-tight">
                Discover Exciting Baby Events
              </h1>
              <p className="text-xl text-nibog-gray mb-8">
                Unleash your little one's potential with our carefully curated baby and toddler events across India.
              </p>
            </div>
            
            <SignedOut>
              <div className="flex space-x-4">
                <Link 
                  href="/sign-up" 
                  className="btn-primary"
                >
                  Create Account
                </Link>
                <Link 
                  href="/events" 
                  className="btn-secondary"
                >
                  Browse Events
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex space-x-4">
                <Link 
                  href="/events" 
                  className="btn-primary"
                >
                  View Events
                </Link>
                <Link 
                  href="/dashboard" 
                  className="btn-secondary"
                >
                  My Dashboard
                </Link>
              </div>
            </SignedIn>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Age-Specific Events",
                description: "Tailored activities for different developmental stages.",
                icon: "🎈"
              },
              {
                title: "Secure Registrations",
                description: "Easy online booking with instant confirmations.",
                icon: "🔒"
              },
              {
                title: "Multiple Cities",
                description: "Events in Bangalore, Mumbai, Delhi, and more!",
                icon: "🌆"
              },
              {
                title: "Expert Guidance",
                description: "Professionally designed activities for child development.",
                icon: "👶"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="card p-6 text-center hover:scale-105 transform transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-nibog-teal mb-3">
                  {feature.title}
                </h3>
                <p className="text-nibog-gray">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
