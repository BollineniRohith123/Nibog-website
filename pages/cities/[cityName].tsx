"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../src/components/Layout';
import { Calendar, MapPin, Filter } from 'react-feather';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

export default function CityLandingPage() {
  const router = useRouter();
  const { cityName } = router.query;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const events: Event[] = [
    {
      id: '1',
      name: 'Junior Soccer League',
      date: '2024-01-15',
      location: 'City Sports Complex',
      description: 'Exciting soccer tournament for young athletes!',
      image: '/events/soccer.jpg',
      category: 'Sports',
      price: 499
    },
    {
      id: '2',
      name: 'Kids Art Workshop',
      date: '2024-02-10',
      location: 'Creative Center',
      description: 'Unleash your child\'s creativity through art!',
      image: '/events/art.jpg',
      category: 'Art',
      price: 299
    },
    {
      id: '3',
      name: 'Music and Dance Festival',
      date: '2024-03-20',
      location: 'City Auditorium',
      description: 'A celebration of music and dance for kids!',
      image: '/events/music.jpg',
      category: 'Music',
      price: 599
    }
  ];

  const categories = [...new Set(events.map(event => event.category))];

  const filteredEvents = selectedCategory 
    ? events.filter(event => event.category === selectedCategory)
    : events;

  return (
    <Layout title={`NIBOG Events in ${cityName}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-h1 text-teal mb-4 md:mb-0">
            Events in {cityName}
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="flex items-center space-x-2 
                  bg-light-cyan text-teal 
                  px-4 py-2 rounded-apple-md 
                  hover:bg-teal hover:text-white 
                  transition duration-300"
                onClick={() => setSelectedCategory(null)}
              >
                <Filter className="h-5 w-5" />
                <span>All Categories</span>
              </button>
            </div>
            
            {categories.map(category => (
              <button
                key={category}
                className={`
                  px-4 py-2 rounded-apple-md 
                  transition duration-300
                  ${selectedCategory === category 
                    ? 'bg-teal text-white' 
                    : 'bg-light-cyan text-teal hover:bg-teal hover:text-white'
                  }
                `}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Link 
              key={event.id} 
              href={`/events/${event.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group"
            >
              <div 
                className="bg-white rounded-apple-lg overflow-hidden 
                  shadow-apple-light 
                  transition duration-300 
                  hover:shadow-apple-medium 
                  hover:-translate-y-2"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={event.image} 
                    alt={event.name} 
                    layout="fill" 
                    objectFit="cover" 
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-h3 text-teal">{event.name}</h3>
                    <div 
                      className="flex items-center space-x-2 
                        bg-light-cyan text-teal 
                        px-3 py-1 rounded-full 
                        text-sm font-semibold"
                    >
                      <span>₹{event.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="pt-4 border-t border-light-blue">
                    <button
                      className="w-full bg-gradient-primary text-white 
                        px-6 py-3 rounded-apple-md 
                        hover:bg-gradient-hover 
                        transition duration-300 
                        shadow-apple-light
                        hover:shadow-apple-medium
                        active:scale-95"
                    >
                      View Event Details
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
