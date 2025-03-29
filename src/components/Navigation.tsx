import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-apple-gray-200 shadow-apple-light">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 48 48" 
            className="w-8 h-8 text-apple-blue-500"
            fill="currentColor"
          >
            <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"/>
            <path d="M24 11c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zm0 22c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9z"/>
          </svg>
          <span className="text-apple-title3 font-semibold text-apple-black">NIBOG</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/events" 
            className="text-apple-body text-apple-gray-700 
                       hover:text-apple-blue-500 
                       transition-apple-all"
          >
            Events
          </Link>
          
          <SignedIn>
            <Link 
              href="/registrations" 
              className="text-apple-body text-apple-gray-700 
                         hover:text-apple-blue-500 
                         transition-apple-all"
            >
              My Registrations
            </Link>
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-9 h-9 border-2 border-apple-gray-200',
                  userButtonPopoverCard: 'apple-card'
                }
              }} 
              afterSignOutUrl="/" 
            />
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
