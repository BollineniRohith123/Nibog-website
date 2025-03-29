import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { 
  UserIcon, 
  CalendarIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  BuildingOfficeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface RegistrationFormData {
  childName: string;
  dateOfBirth: string;
  parentName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  emergencyContact: string;
  medicalConditions: string;
}

export default function EventRegistration() {
  const router = useRouter();
  const { id } = router.query;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    childName: '',
    dateOfBirth: '',
    parentName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    emergencyContact: '',
    medicalConditions: '',
  });

  // Mock event data
  const event = {
    name: 'Mumbai Baby Olympics 2024',
    date: 'March 15, 2024',
    location: 'Mumbai Sports Arena',
    price: '₹1,499',
    imageUrl: '/events/mumbai.jpg',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= stepNumber
                ? 'bg-[#008080] text-white'
                : 'bg-[#F0E68C] text-[#8B8B83]'
            }`}
          >
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div
              className={`w-16 h-1 ${
                step > stepNumber ? 'bg-[#008080]' : 'bg-[#F0E68C]'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#008080] mb-6">
              Child Information
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8B83]" />
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleInputChange}
                  placeholder="Child's Full Name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  required
                />
              </div>
              <div className="relative">
                <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8B83]" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#008080] mb-6">
              Parent/Guardian Information
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8B83]" />
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  placeholder="Parent/Guardian Name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  required
                />
              </div>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8B83]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  required
                />
              </div>
              <div className="relative">
                <PhoneIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8B83]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#008080] mb-6">
              Additional Information
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <BuildingOfficeIcon className="h-5 w-5 absolute left-3 top-3 text-[#8B8B83]" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full Address"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div className="relative">
                <PhoneIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8B83]" />
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Emergency Contact Number"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  required
                />
              </div>
              <div className="relative">
                <InformationCircleIcon className="h-5 w-5 absolute left-3 top-3 text-[#8B8B83]" />
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  placeholder="Any medical conditions or allergies (if any)"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout title="Event Registration - NIBOG">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Event Information Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div className="relative h-48">
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-[#008080]">
                  {event.name}
                </h3>
                <div className="space-y-2 text-sm text-[#8B8B83]">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BuildingOfficeIcon className="h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8B8B83]">Registration Fee</span>
                    <span className="text-lg font-bold text-[#E97451]">
                      {event.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-[#008080] mb-6">
                Event Registration
              </h1>
              
              {renderStepIndicator()}
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {renderFormStep()}
                
                <div className="flex justify-between pt-6">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}
                  
                  {step < 3 ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleNext}
                      className="ml-auto"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      className="ml-auto"
                    >
                      Complete Registration
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
