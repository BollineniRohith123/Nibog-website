import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface EventCardProps {
  id: string;
  name: string;
  description: string;
  date: string;
  location?: string;
  imageUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  id, 
  name, 
  description, 
  date,
  location,
  imageUrl 
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#40E0D0] to-[#008080] flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <h2 className="text-[#008080] text-xl font-bold leading-tight hover:text-[#006400] transition-colors">
          {name}
        </h2>
        
        <p className="text-[#8B8B83] text-sm line-clamp-2">
          {description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-[#5F9EA0]">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{date}</span>
          </div>
          
          {location && (
            <div className="flex items-center text-sm text-[#5F9EA0]">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>{location}</span>
            </div>
          )}
        </div>
        
        <Link 
          href={`/events/${id}`}
          className="inline-block w-full text-center bg-[#E97451] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#228B22] transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
