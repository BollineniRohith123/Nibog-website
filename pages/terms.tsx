"use client";

import React from 'react';
import Layout from '../src/components/Layout';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clipboard 
} from 'react-feather';

export default function TermsOfServicePage() {
  const termsSections = [
    {
      title: "User Eligibility",
      content: [
        "Parents or legal guardians must register and manage accounts",
        "Children must be within the specified age range for events",
        "One account per family is recommended"
      ],
      icon: CheckCircle,
      iconColor: "text-green-500"
    },
    {
      title: "Event Participation Rules",
      content: [
        "Timely registration and payment required",
        "Adherence to event-specific guidelines",
        "Respectful behavior towards staff and other participants",
        "Medical information must be disclosed during registration"
      ],
      icon: Clipboard,
      iconColor: "text-teal"
    },
    {
      title: "Liability and Risks",
      content: [
        "Parents acknowledge inherent risks in sports activities",
        "NIBOG provides supervised and safety-checked environments",
        "Medical emergency protocols are in place",
        "Waiver of liability required for event participation"
      ],
      icon: AlertTriangle,
      iconColor: "text-orange-500"
    }
  ];

  return (
    <Layout title="NIBOG - Terms of Service">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="bg-light-cyan rounded-full p-4 inline-block mb-6">
              <FileText className="h-12 w-12 text-teal" />
            </div>
            <h1 className="text-h1 text-teal mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto">
              By using NIBOG, you agree to these terms that ensure a safe, fair, and enjoyable experience for all participants.
            </p>
          </section>

          {/* Terms Sections */}
          <section className="mb-16 space-y-8">
            {termsSections.map((section) => {
              const Icon = section.icon;
              return (
                <div 
                  key={section.title}
                  className="bg-white rounded-apple-lg shadow-apple-light p-8 
                    flex items-start space-x-6 
                    transition duration-300 hover:-translate-y-2"
                >
                  <div 
                    className={`bg-light-cyan rounded-full p-4 
                      flex items-center justify-center`}
                  >
                    <Icon 
                      className={`h-10 w-10 ${section.iconColor}`} 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-h3 text-teal mb-6">
                      {section.title}
                    </h3>
                    <ul className="list-disc list-inside space-y-3 text-gray">
                      {section.content.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Payment and Cancellation */}
          <section className="mb-16 bg-light-cyan rounded-apple-lg p-8">
            <h2 className="text-h2 text-teal text-center mb-8">
              Payment and Cancellation Policy
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-apple-lg p-6 shadow-apple-light">
                <h3 className="text-h3 text-teal mb-4">
                  Payment Terms
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray">
                  <li>Full payment required at registration</li>
                  <li>Secure online payment methods</li>
                  <li>Refunds processed within 7-10 business days</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-apple-lg p-6 shadow-apple-light">
                <h3 className="text-h3 text-teal mb-4">
                  Cancellation Policy
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray">
                  <li>Free cancellation up to 7 days before event</li>
                  <li>50% refund 3-7 days before event</li>
                  <li>No refunds within 3 days of event</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Legal Disclaimer */}
          <section className="bg-white rounded-apple-lg shadow-apple-light p-12 text-center">
            <h2 className="text-h2 text-teal mb-6">
              Legal Disclaimer
            </h2>
            <p className="text-gray max-w-2xl mx-auto mb-8">
              These terms are subject to change. We reserve the right to modify 
              our terms at any time. Continued use of the platform constitutes 
              acceptance of any changes.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-gradient-primary text-white 
                px-6 py-3 rounded-apple-md 
                hover:bg-gradient-hover 
                transition duration-300 
                shadow-apple-light"
            >
              Contact Legal Team
            </a>
          </section>
        </div>
      </div>
    </Layout>
  );
}
