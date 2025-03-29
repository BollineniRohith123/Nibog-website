"use client";

import React, { useState } from 'react';
import Layout from '../src/components/Layout';
import { ChevronDown, ChevronUp } from 'react-feather';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const faqs: FAQItem[] = [
    {
      question: "What is NIBOG?",
      answer: "NIBOG is a platform dedicated to organizing sports and recreational events for children, helping them develop skills, make friends, and have fun."
    },
    {
      question: "How old do children need to be to participate?",
      answer: "Our events cater to children aged 4-16, with specific age groups for different activities to ensure safety and appropriate skill levels."
    },
    {
      question: "Are the events safe?",
      answer: "Absolutely! We prioritize child safety with trained professionals, proper equipment, and carefully designed activities that meet strict safety standards."
    },
    {
      question: "How do I register for an event?",
      answer: "You can easily register for events through our website. Browse events, select the one you're interested in, and follow the registration process on the event page."
    },
    {
      question: "What if my child needs to cancel?",
      answer: "We offer flexible cancellation policies. Most events can be cancelled up to 7 days before the event date with a full refund."
    },
    {
      question: "Do parents need to stay during the event?",
      answer: "It depends on the event and your child's age. For younger children, parental supervision is recommended. Specific details are provided for each event."
    },
    {
      question: "What should my child bring?",
      answer: "Each event listing will specify required equipment or clothing. Generally, comfortable sportswear and water bottles are recommended."
    },
    {
      question: "How are events priced?",
      answer: "Pricing varies based on the type of event, duration, and included amenities. Prices are transparently displayed on each event page."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Layout title="NIBOG - Frequently Asked Questions">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-h1 text-teal text-center mb-12">
            Frequently Asked Questions
          </h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-apple-lg shadow-apple-light overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center 
                    p-6 text-left 
                    bg-light-cyan hover:bg-teal hover:text-white 
                    transition duration-300 
                    focus:outline-none"
                >
                  <h3 className="text-h3 text-teal">{faq.question}</h3>
                  {activeIndex === index ? (
                    <ChevronUp className="h-6 w-6" />
                  ) : (
                    <ChevronDown className="h-6 w-6" />
                  )}
                </button>

                {activeIndex === index && (
                  <div 
                    className="p-6 bg-white text-gray 
                      border-t border-light-blue 
                      animate-fade-in-down"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-light-cyan rounded-apple-lg p-8">
            <h2 className="text-h2 text-teal mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray mb-6">
              We're here to help! If you can't find the answer you're looking for, 
              please don't hesitate to reach out to our support team.
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
