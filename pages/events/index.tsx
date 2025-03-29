"use client";

import React, { useState } from 'react';
import Layout from '../../src/components/Layout';
import EventCard from '../../src/components/EventCard';
import { Search, Filter, MapPin, Calendar } from 'react-feather';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  image: string;
  spots: number;
  ageGroup: string;
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');

  // Mock data for demonstration
  const events: Event[] = [
    {
      id: '1',
      title: 'Mumbai Baby Olympics 2024',
      description: 'Join us for the biggest baby sports event in Mumbai!',
      date: '2024-03-15',
      location: 'Mumbai',
      price: 1499,
      image: '/events/mumbai.jpg',
      spots: 100,
      ageGroup: '1-2 years'
    },
    {
      id: '2',
      title: 'Delhi Tiny Tots Challenge',
      description: 'Exciting sports activities for the little champions of Delhi!',
      date: '2024-04-20',
      location: 'Delhi',
      price: 1299,
      image: '/events/delhi.jpg',
      spots: 75,
      ageGroup: '6-12 months'
    },
    {
      id: '3',
      title: 'Bangalore Junior Sports Fest',
      description: 'A fun-filled sports event for babies in Bangalore!',
      date: '2024-05-10',
      location: 'Bangalore',
      price: 1599,
      image: '/events/bangalore.jpg',
      spots: 50,
      ageGroup: '2-3 years'
    }
  ];

  const cities = ['all', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'];
  const ageGroups = ['all', '6-12 months', '1-2 years', '2-3 years', '3-4 years'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || event.location === selectedCity;
    const matchesAge = selectedAgeGroup === 'all' || event.ageGroup === selectedAgeGroup;
    return matchesSearch && matchesCity && matchesAge;
  });

  return (
    <Layout title="NIBOG Events">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-h1 text-teal mb-8 text-center">Upcoming NIBOG Events</h1>

        {/* Search and Filter Section */}
        <div className="mb-12 grid md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-light-cyan" />
            </div>
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-apple-md 
                border border-light-cyan 
                focus:ring-2 focus:ring-teal/50 
                focus:border-teal 
                transition duration-300"
            />
          </div>

          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-light-cyan" />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-apple-md 
                border border-light-cyan 
                focus:ring-2 focus:ring-teal/50 
                focus:border-teal 
                transition duration-300"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-light-cyan" />
            </div>
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-apple-md 
                border border-light-cyan 
                focus:ring-2 focus:ring-teal/50 
                focus:border-teal 
                transition duration-300"
            >
              {ageGroups.map(group => (
                <option key={group} value={group}>
                  {group === 'all' ? 'All Age Groups' : group}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard 
                key={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                price={event.price}
                image={event.image}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray">
              <p>No events found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
