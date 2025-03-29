"use client";

import React from 'react';
import Layout from '../src/components/Layout';
import { Shield, Lock, Users, FileText } from 'react-feather';

export default function PrivacyPolicyPage() {
  const privacySections = [
    {
      title: "Information We Collect",
      content: [
        "Personal information provided during registration (name, email, phone)",
        "Child's information for event registration",
        "Payment and transaction details",
        "Device and usage information"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "Process event registrations",
        "Communicate event details and updates",
        "Improve our services and user experience",
        "Ensure platform security"
      ]
    },
    {
      title: "Data Protection Measures",
      content: [
        "Encryption of sensitive personal information",
        "Secure payment gateway integrations",
        "Regular security audits",
        "Restricted access to personal data"
      ]
    }
  ];

  return (
    <Layout title="NIBOG - Privacy Policy">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="bg-light-cyan rounded-full p-4 inline-block mb-6">
              <Shield className="h-12 w-12 text-teal" />
            </div>
            <h1 className="text-h1 text-teal mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto">
              At NIBOG, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
          </section>

          {/* Key Privacy Principles */}
          <section className="mb-16">
            <h2 className="text-h2 text-teal text-center mb-12">
              Our Privacy Principles
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div 
                className="bg-white rounded-apple-lg shadow-apple-light 
                  p-6 text-center transition duration-300 hover:-translate-y-2"
              >
                <div className="bg-light-cyan rounded-full p-4 inline-block mb-4">
                  <Lock className="h-8 w-8 text-teal" />
                </div>
                <h3 className="text-h3 text-teal mb-4">
                  Data Security
                </h3>
                <p className="text-gray">
                  We implement robust security measures to protect your data from unauthorized access.
                </p>
              </div>

              <div 
                className="bg-white rounded-apple-lg shadow-apple-light 
                  p-6 text-center transition duration-300 hover:-translate-y-2"
              >
                <div className="bg-light-cyan rounded-full p-4 inline-block mb-4">
                  <Users className="h-8 w-8 text-teal" />
                </div>
                <h3 className="text-h3 text-teal mb-4">
                  Transparency
                </h3>
                <p className="text-gray">
                  We are clear about what data we collect and how we use it.
                </p>
              </div>

              <div 
                className="bg-white rounded-apple-lg shadow-apple-light 
                  p-6 text-center transition duration-300 hover:-translate-y-2"
              >
                <div className="bg-light-cyan rounded-full p-4 inline-block mb-4">
                  <FileText className="h-8 w-8 text-teal" />
                </div>
                <h3 className="text-h3 text-teal mb-4">
                  User Control
                </h3>
                <p className="text-gray">
                  You have the right to access, update, and delete your personal information.
                </p>
              </div>
            </div>
          </section>

          {/* Detailed Privacy Sections */}
          <section className="mb-16">
            {privacySections.map((section, index) => (
              <div 
                key={section.title} 
                className={`bg-white rounded-apple-lg shadow-apple-light p-8 mb-8 
                  ${index % 2 === 0 ? 'bg-opacity-100' : 'bg-light-cyan bg-opacity-50'}`}
              >
                <h3 className="text-h3 text-teal mb-6">
                  {section.title}
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray">
                  {section.content.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Consent and Contact */}
          <section className="bg-light-cyan rounded-apple-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-teal mb-6">
              Your Consent Matters
            </h2>
            <p className="text-gray max-w-2xl mx-auto mb-8">
              By using NIBOG, you consent to our privacy policy. If you have any questions 
              or concerns about your privacy, please contact our support team.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-gradient-primary text-white 
                px-6 py-3 rounded-apple-md 
                hover:bg-gradient-hover 
                transition duration-300 
                shadow-apple-light"
            >
              Contact Privacy Team
            </a>
          </section>
        </div>
      </div>
    </Layout>
  );
}