"use client";

import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Home, Calendar, MapPin, User, LogIn } from 'react-feather';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  hideNavigation?: boolean;
}

const NavLink = ({ 
  href, 
  children, 
  icon: Icon 
}: { 
  href: string, 
  children: ReactNode, 
  icon?: React.ElementType 
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link 
      href={href} 
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-apple-md 
        transition duration-300 group
        ${isActive 
          ? 'bg-teal text-white' 
          : 'text-gray hover:bg-light-cyan hover:text-teal'
        }
      `}
    >
      {Icon && (
        <Icon 
          className={`
            w-5 h-5 
            ${isActive ? 'text-white' : 'text-light-cyan group-hover:text-teal'}
          `} 
        />
      )}
      <span>{children}</span>
    </Link>
  );
};

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'NIBOG Event Booking', 
  description = 'Register for exciting NIBOG events for babies and young children',
  hideNavigation = false
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-pale-yellow font-primary">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {!hideNavigation && (
        <header className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-apple-light border-t border-light-blue">
          <nav className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center space-x-4">
              <NavLink href="/" icon={Home}>Home</NavLink>
              <NavLink href="/events" icon={Calendar}>Events</NavLink>
              <Link href="/" className="flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="NIBOG Logo" 
                  width={60} 
                  height={60} 
                  className="rounded-full shadow-apple-light transition duration-300 hover:scale-110 active:scale-95"
                />
              </Link>
              <NavLink href="/cities" icon={MapPin}>Cities</NavLink>
              <SignedIn>
                <NavLink href="/profile" icon={User}>Profile</NavLink>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button 
                    className="
                      flex items-center space-x-2 
                      bg-gradient-primary text-white 
                      px-4 py-2 rounded-apple-md 
                      shadow-apple-light
                      hover:shadow-apple-medium
                      transition duration-300
                      active:scale-95
                    "
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
        </header>
      )}

      <main className={`
        flex-grow 
        ${!hideNavigation ? 'pb-20' : ''} 
        container mx-auto px-4 py-8
      `}>
        {children}
      </main>

      {!hideNavigation && (
        <footer className="bg-teal text-white py-8">
          <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">NIBOG</h3>
              <p className="text-light-blue">Discover, Book, Experience</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <nav className="space-y-2">
                <Link href="/events" className="text-light-blue hover:text-white transition">Events</Link>
                <Link href="/cities" className="text-light-blue hover:text-white transition">Cities</Link>
                <Link href="/about" className="text-light-blue hover:text-white transition">About</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <nav className="space-y-2">
                <Link href="/contact" className="text-light-blue hover:text-white transition">Contact</Link>
                <Link href="/faq" className="text-light-blue hover:text-white transition">FAQ</Link>
                <Link href="/help" className="text-light-blue hover:text-white transition">Help Center</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <nav className="space-y-2">
                <Link href="/privacy" className="text-light-blue hover:text-white transition">Privacy Policy</Link>
                <Link href="/terms" className="text-light-blue hover:text-white transition">Terms of Service</Link>
              </nav>
            </div>
          </div>
          <div className="text-center mt-8 text-light-blue">
            &copy; {new Date().getFullYear()} NIBOG. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
