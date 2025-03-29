import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from '../src/components/Navigation';
import Footer from '../src/components/Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'NIBOG Event Booking' }) => {
  return (
    <div className="min-h-screen bg-[#F0E68C] flex flex-col font-montserrat">
      <Head>
        <title>{title}</title>
        <meta name="description" content="NIBOG Event Booking Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
