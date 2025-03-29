import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const AdminSettingsPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [emailTemplate, setEmailTemplate] = useState({
    subject: '',
    body: ''
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (!user || user.publicMetadata.role !== 'admin') {
    router.push('/');
    return null;
  }

  const handleSaveTemplate = async () => {
    try {
      // Implement email template saving logic
      toast.success('Email template saved successfully');
    } catch (error) {
      toast.error('Failed to save email template');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Email Templates</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Email Subject</label>
            <input 
              type="text"
              value={emailTemplate.subject}
              onChange={(e) => setEmailTemplate({...emailTemplate, subject: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Email Body</label>
            <textarea 
              value={emailTemplate.body}
              onChange={(e) => setEmailTemplate({...emailTemplate, body: e.target.value})}
              className="w-full p-2 border rounded h-40"
            />
          </div>
          <button 
            onClick={handleSaveTemplate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Template
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminSettingsPage;
