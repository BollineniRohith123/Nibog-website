"use client";

import React, { useState } from 'react';
import Layout from '../src/components/Layout';
import { 
  HelpCircle, 
  Book, 
  Shield, 
  MessageCircle, 
  Search, 
  ArrowRight 
} from 'react-feather';

interface HelpResource {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const helpResources: HelpResource[] = [
    {
      icon: Book,
      title: 'User Guide',
      description: 'Comprehensive guide to using NIBOG platform',
      link: '/user-guide'
    },
    {
      icon: Shield,
      title: 'Safety Policies',
      description: 'Our commitment to child safety and event standards',
      link: '/safety'
    },
    {
      icon: MessageCircle,
      title: 'Support Channels',
      description: 'Multiple ways to get help and support',
      link: '/contact'
    }
  ];

  const supportTopics = [
    'Event Registration',
    'Account Management',
    'Payment Issues',
    'Cancellation Policy',
    'Child Safety',
    'Event Guidelines'
  ];

  const filteredTopics = supportTopics.filter(topic => 
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="NIBOG - Help Center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="bg-light-cyan rounded-full p-4 inline-block mb-6">
              <HelpCircle className="h-12 w-12 text-teal" />
            </div>
            <h1 className="text-h1 text-teal mb-4">
              How Can We Help You Today?
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto">
              Find answers, get support, and learn more about NIBOG's mission and services.
            </p>
          </section>

          {/* Search Section */}
          <section className="mb-16">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-apple-lg border border-light-blue 
                  focus:border-teal focus:ring-2 focus:ring-teal-light
                  pl-12"
              />
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 
                  text-gray h-6 w-6"
              />
            </div>

            {searchQuery && (
              <div className="mt-4 bg-white rounded-apple-lg shadow-apple-light p-4">
                <h3 className="text-h3 text-teal mb-4">
                  Search Results
                </h3>
                {filteredTopics.length > 0 ? (
                  <ul className="space-y-2">
                    {filteredTopics.map(topic => (
                      <li 
                        key={topic} 
                        className="flex justify-between items-center 
                          p-3 hover:bg-light-cyan rounded-apple-md 
                          transition duration-300 cursor-pointer"
                      >
                        <span className="text-gray">{topic}</span>
                        <ArrowRight className="text-teal h-5 w-5" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray text-center">
                    No topics found matching your search.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Resources Section */}
          <section className="mb-16">
            <h2 className="text-h2 text-teal text-center mb-12">
              Help Resources
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {helpResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <a 
                    key={resource.title} 
                    href={resource.link}
                    className="group"
                  >
                    <div 
                      className="bg-white rounded-apple-lg shadow-apple-light 
                        p-8 text-center 
                        transition duration-300 
                        hover:-translate-y-2 
                        hover:shadow-apple-medium"
                    >
                      <div 
                        className="bg-light-cyan rounded-full p-4 
                          inline-block mb-6 group-hover:bg-teal 
                          transition duration-300"
                      >
                        <Icon 
                          className="h-10 w-10 text-teal 
                            group-hover:text-white 
                            transition duration-300"
                        />
                      </div>
                      
                      <h3 className="text-h3 text-teal mb-4">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray mb-6">
                        {resource.description}
                      </p>
                      
                      <div 
                        className="flex items-center justify-center 
                          space-x-2 text-teal 
                          group-hover:underline"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-light-cyan rounded-apple-lg p-12 text-center">
            <h2 className="text-h2 text-teal mb-6">
              Need Personalized Support?
            </h2>
            <p className="text-gray max-w-2xl mx-auto mb-8">
              Our dedicated support team is ready to assist you with any questions 
              or concerns you may have about NIBOG events and services.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-gradient-primary text-white 
                px-6 py-3 rounded-apple-md 
                hover:bg-gradient-hover 
                transition duration-300 
                shadow-apple-light"
            >
              Contact Support
            </a>
          </section>
        </div>
      </div>
    </Layout>
  );
}
