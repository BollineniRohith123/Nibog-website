"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EventCard from '../src/components/EventCard';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Search, MapPin, Calendar } from 'react-feather';

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Tech Innovation Summit',
    description: 'Explore groundbreaking technologies and network with industry leaders.',
    date: '2024-02-15',
    location: 'Silicon Valley Convention Center',
    price: 299.99,
    image: '/events/tech-summit.jpg'
  },
  {
    id: '2',
    title: 'Design Thinking Workshop',
    description: 'Master the art of user-centric design and creative problem solving.',
    date: '2024-03-22',
    location: 'Creative Hub, San Francisco',
    price: 199.50,
    image: '/events/design-workshop.jpg'
  }
];

export default function Home() {
  const [searchCity, setSearchCity] = useState('');
  const [searchDate, setSearchDate] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-apple-white to-gray-50 text-apple-black">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <div 
                className="flex items-center space-x-3 cursor-pointer 
                  hover:scale-105 transition duration-300
                  active:scale-95"
              >
                <Image 
                  src="/logo.png" 
                  alt="Nibog Logo" 
                  width={50} 
                  height={50} 
                  className="rounded-full shadow-md"
                />
                <span className="text-2xl font-bold text-button-primary tracking-tight">Nibog</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              {['Events', 'Cities', 'About'].map((item) => (
                <div 
                  key={item}
                  className="relative group"
                >
                  <Link href={`/${item.toLowerCase()}`}>
                    <span className="text-apple-gray group-hover:text-button-primary 
                      transition-colors duration-300 
                      relative after:absolute after:bottom-[-4px] after:left-0 
                      after:w-0 after:h-[2px] after:bg-button-primary 
                      after:transition-all after:duration-300 
                      group-hover:after:w-full cursor-pointer">
                      {item}
                    </span>
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className="bg-gradient-primary text-white px-6 py-3 rounded-apple-md 
                      hover:bg-gradient-hover transition duration-300
                      shadow-button-primary hover:shadow-button-glow
                      active:scale-95 focus:outline-none focus:ring-2 focus:ring-button-primary/50
                      transform hover:-translate-y-1"
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 
            className="text-6xl font-bold mb-6 text-transparent bg-clip-text 
              bg-gradient-to-r from-button-primary to-button-secondary 
              tracking-tight leading-tight"
          >
            Discover Extraordinary Events
          </h1>
          
          <p
            className="text-xl text-apple-gray max-w-2xl mx-auto mb-10"
          >
            Explore, Book, and Experience Unforgettable Moments
          </p>

          {/* Search and Filter Section */}
          <div 
            className="max-w-3xl mx-auto flex space-x-4"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-button-primary" />
              </div>
              <input 
                type="text" 
                placeholder="Search by City" 
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-apple-md 
                  border border-gray-200 
                  focus:ring-2 focus:ring-button-primary/50 
                  focus:border-button-primary 
                  transition duration-300 
                  text-apple-black placeholder-apple-gray"
              />
            </div>
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-button-secondary" />
              </div>
              <input 
                type="date" 
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-apple-md 
                  border border-gray-200 
                  focus:ring-2 focus:ring-button-primary/50 
                  focus:border-button-primary 
                  transition duration-300 
                  text-apple-black"
              />
            </div>
            
            <button
              className="bg-gradient-primary text-white px-6 py-3 rounded-apple-md 
                hover:bg-gradient-hover transition duration-300
                shadow-button-primary hover:shadow-button-glow
                flex items-center justify-center
                active:scale-95"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2
          className="text-4xl font-bold mb-10 text-center text-transparent bg-clip-text 
            bg-gradient-to-r from-button-primary to-button-secondary"
        >
          Upcoming Events
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_EVENTS.map((event, index) => (
            <div key={event.id}>
              <EventCard 
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                price={event.price}
                image={event.image}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-button-primary to-button-secondary text-white py-16 text-center">
        <div
          className="max-w-4xl mx-auto px-4"
        >
          <h2 className="text-5xl font-bold mb-6">Ready to Explore?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/80">
            Join thousands of users discovering incredible events tailored just for you.
          </p>
          <div className="flex justify-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="bg-white text-button-primary px-8 py-4 rounded-apple-md 
                    text-lg font-semibold 
                    hover:bg-gray-100 transition duration-300
                    shadow-button-secondary 
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-button-primary/50
                    transform hover:-translate-y-1"
                >
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/events">
                <button
                  className="bg-white text-button-secondary px-8 py-4 rounded-apple-md 
                    text-lg font-semibold 
                    hover:bg-gray-100 transition duration-300
                    shadow-button-secondary 
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-button-secondary/50
                    transform hover:-translate-y-1"
                >
                  Browse Events
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-apple-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-button-primary">Nibog</h3>
            <p className="text-apple-gray">Discover, Book, Experience</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/events" className="text-apple-gray hover:text-button-primary transition-colors">Events</Link>
              <Link href="/cities" className="text-apple-gray hover:text-button-primary transition-colors">Cities</Link>
              <Link href="/about" className="text-apple-gray hover:text-button-primary transition-colors">About</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <nav className="space-y-2">
              <Link href="/contact" className="text-apple-gray hover:text-button-primary transition-colors">Contact</Link>
              <Link href="/faq" className="text-apple-gray hover:text-button-primary transition-colors">FAQ</Link>
              <Link href="/help" className="text-apple-gray hover:text-button-primary transition-colors">Help Center</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <nav className="space-y-2">
              <Link href="/privacy" className="text-apple-gray hover:text-button-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-apple-gray hover:text-button-primary transition-colors">Terms of Service</Link>
            </nav>
          </div>
        </div>
        <div className="text-center mt-8 text-apple-gray">
          {new Date().getFullYear()} Nibog. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
