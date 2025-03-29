"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, DollarSign } from 'react-feather';

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  image: string;
  eventId?: number | string; // Add this line
}

const EventCard: React.FC<EventCardProps> = ({ 
  title, 
  description, 
  date, 
  location, 
  price, 
  image,
  eventId
}) => {
  return (
    <div 
      className="bg-white rounded-apple-lg overflow-hidden 
        shadow-apple-light hover:shadow-apple-medium 
        transition duration-300 
        border border-gray-100 
        hover:-translate-y-2 hover:scale-105"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          layout="fill" 
          objectFit="cover" 
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2 text-button-primary truncate">
            {title}
          </h3>
          <p className="text-apple-gray text-sm line-clamp-2">
            {description}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-apple-gray">
            <Calendar className="h-5 w-5 mr-2 text-button-primary" />
            <span className="text-sm">{new Date(date).toLocaleDateString('en-US', {
              weekday: 'short', 
              month: 'short', 
              day: 'numeric'
            })}</span>
          </div>
          
          <div className="flex items-center text-apple-gray">
            <MapPin className="h-5 w-5 mr-2 text-button-secondary" />
            <span className="text-sm truncate">{location}</span>
          </div>
          
          <div className="flex items-center text-apple-gray">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
            <span className="text-sm font-semibold">
              {price.toLocaleString('en-US', { 
                style: 'currency', 
                currency: 'USD' 
              })}
            </span>
          </div>
        </div>
        
        <Link href={eventId ? `/events/${eventId}` : `/events/${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <button
            className="w-full bg-gradient-primary text-white 
              px-6 py-3 rounded-apple-md 
              hover:bg-gradient-hover 
              transition duration-300 
              shadow-button-primary 
              hover:shadow-button-glow
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-button-primary/50
              hover:-translate-y-1"
          >
            Book Event
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;