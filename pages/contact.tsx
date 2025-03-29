"use client";

import React, { useState } from 'react';
import Layout from '../src/components/Layout';
import { Mail, Phone, MapPin, Send } from 'react-feather';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitStatus('sending');
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Reset form and show success
        setFormData({ name: '', email: '', phone: '', message: '' });
        setSubmitStatus('success');
      } catch (error) {
        setSubmitStatus('error');
      }
    }
  };

  return (
    <Layout title="Contact NIBOG">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information Section */}
          <div className="space-y-8">
            <h1 className="text-h1 text-teal mb-6">
              Get In Touch
            </h1>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-light-cyan p-3 rounded-full">
                  <Mail className="h-6 w-6 text-teal" />
                </div>
                <div>
                  <h3 className="text-h3 text-teal">Email</h3>
                  <p className="text-gray">support@nibog.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-light-cyan p-3 rounded-full">
                  <Phone className="h-6 w-6 text-teal" />
                </div>
                <div>
                  <h3 className="text-h3 text-teal">Phone</h3>
                  <p className="text-gray">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-light-cyan p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-teal" />
                </div>
                <div>
                  <h3 className="text-h3 text-teal">Address</h3>
                  <p className="text-gray">
                    123 NIBOG Street, Tech Park,
                    Bangalore, Karnataka 560001
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed (Optional) */}
            <div className="w-full h-64 bg-light-blue rounded-apple-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6345395451!2d77.59!3d12.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzA1LjciTiA3N8KwMzUnMjQuMCJF!5e0!3m2!1sen!2sus!4v1638947882640!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form Section */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-apple-md border 
                    ${errors.name ? 'border-red-500' : 'border-light-blue'}
                    focus:border-teal focus:ring-2 focus:ring-teal-light`}
                  placeholder="Your Name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-gray mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-apple-md border 
                    ${errors.email ? 'border-red-500' : 'border-light-blue'}
                    focus:border-teal focus:ring-2 focus:ring-teal-light`}
                  placeholder="Your Email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-apple-md border border-light-blue 
                    focus:border-teal focus:ring-2 focus:ring-teal-light"
                  placeholder="Your Phone Number"
                />
              </div>

              <div>
                <label className="block text-gray mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className={`w-full px-4 py-3 rounded-apple-md border 
                    ${errors.message ? 'border-red-500' : 'border-light-blue'}
                    focus:border-teal focus:ring-2 focus:ring-teal-light h-32`}
                  placeholder="Your Message"
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitStatus === 'sending'}
                className={`w-full flex items-center justify-center space-x-3 
                  px-6 py-4 rounded-apple-md text-white 
                  transition duration-300 
                  ${submitStatus === 'sending' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-primary hover:bg-gradient-hover'
                  }`}
              >
                {submitStatus === 'sending' ? (
                  <>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-apple-md mt-4">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-apple-md mt-4">
                  Oops! Something went wrong. Please try again later.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
