"use client";

import React from 'react';
import Image from 'next/image';
import Layout from '../src/components/Layout';
import { Award, Target, Heart } from 'react-feather';

const teamMembers = [
  {
    name: 'Rohith Srinivas',
    role: 'Founder & CEO',
    image: '/team/rohith.jpg',
    bio: 'Passionate about creating opportunities for children to explore and grow through sports.'
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Operations',
    image: '/team/priya.jpg',
    bio: 'Dedicated to ensuring smooth event management and child safety.'
  },
  {
    name: 'Arjun Patel',
    role: 'Program Director',
    image: '/team/arjun.jpg',
    bio: 'Expert in designing engaging and educational sports programs for kids.'
  }
];

export default function AboutPage() {
  return (
    <Layout title="About NIBOG">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-h1 text-teal mb-6">
            Empowering Children Through Sports
          </h1>
          <p className="text-xl text-gray max-w-3xl mx-auto">
            NIBOG is more than just a sports event platform. We're a community dedicated to nurturing young talents, building confidence, and creating lifelong memories.
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-apple-lg shadow-apple-light p-6 text-center">
            <div className="flex justify-center mb-4">
              <Target className="h-12 w-12 text-teal" />
            </div>
            <h3 className="text-h3 text-teal mb-4">Our Mission</h3>
            <p className="text-gray">
              To provide inclusive, fun, and skill-building sports experiences for children of all backgrounds.
            </p>
          </div>

          <div className="bg-white rounded-apple-lg shadow-apple-light p-6 text-center">
            <div className="flex justify-center mb-4">
              <Award className="h-12 w-12 text-teal" />
            </div>
            <h3 className="text-h3 text-teal mb-4">Our Vision</h3>
            <p className="text-gray">
              To become the leading platform for children's sports events, inspiring the next generation of athletes.
            </p>
          </div>

          <div className="bg-white rounded-apple-lg shadow-apple-light p-6 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-teal" />
            </div>
            <h3 className="text-h3 text-teal mb-4">Our Values</h3>
            <p className="text-gray">
              Inclusivity, Fun, Safety, Personal Growth, and Community Building.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-h2 text-teal text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.name} 
                className="bg-white rounded-apple-lg shadow-apple-light overflow-hidden 
                  transition duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64 w-full">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    layout="fill" 
                    objectFit="cover" 
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-h3 text-teal mb-2">{member.name}</h3>
                  <p className="text-gray mb-4">{member.role}</p>
                  <p className="text-gray italic">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="bg-light-cyan rounded-apple-lg p-12 text-center">
          <h2 className="text-h2 text-teal mb-6">
            Our Impact So Far
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <p className="text-h2 text-teal font-bold">500+</p>
              <p className="text-gray">Events Hosted</p>
            </div>
            <div>
              <p className="text-h2 text-teal font-bold">10,000+</p>
              <p className="text-gray">Children Participated</p>
            </div>
            <div>
              <p className="text-h2 text-teal font-bold">25+</p>
              <p className="text-gray">Cities Covered</p>
            </div>
            <div>
              <p className="text-h2 text-teal font-bold">95%</p>
              <p className="text-gray">Satisfaction Rate</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
