"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../src/components/Layout';
import { MapPin } from 'react-feather';

interface City {
  name: string;
  description: string;
  image: string;
  eventCount: number;
}

export default function CitiesPage() {
  const cities: City[] = [
    {
      name: 'Mumbai',
      description: 'The city of dreams hosts exciting baby sports events!',
      image: '/cities/mumbai.jpg',
      eventCount: 5
    },
    {
      name: 'Delhi',
      description: 'Experience the capital\'s vibrant baby sports scene!',
      image: '/cities/delhi.jpg',
      eventCount: 4
    },
    {
      name: 'Bangalore',
      description: 'Tech city with innovative baby sports programs!',
      image: '/cities/bangalore.jpg',
      eventCount: 3
    },
    {
      name: 'Chennai',
      description: 'Cultural hub with amazing baby sports opportunities!',
      image: '/cities/chennai.jpg',
      eventCount: 2
    },
    {
      name: 'Hyderabad',
      description: 'Discover exciting events in the city of pearls!',
      image: '/cities/hyderabad.jpg',
      eventCount: 3
    }
  ];

  return (
    <Layout title="NIBOG Cities">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-h1 text-teal mb-8 text-center">
          NIBOG Events by City
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {cities.map((city) => (
            <Link 
              key={city.name} 
              href={`/cities/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                    src={city.image} 
                    alt={city.name} 
                    layout="fill" 
                    objectFit="cover" 
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-h3 text-teal">{city.name}</h3>
                    <div 
                      className="flex items-center space-x-2 
                        bg-light-cyan text-teal 
                        px-3 py-1 rounded-full 
                        text-sm font-semibold"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>{city.eventCount} Events</span>
                    </div>
                  </div>
                  
                  <p className="text-gray line-clamp-2">
                    {city.description}
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
                      View City Events
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
