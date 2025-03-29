import React from 'react';
import { useUser } from '@clerk/nextjs';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/Button';
import {
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  MapPinIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend }) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#F0E68C] rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-[#8B8B83]">{title}</p>
            <h3 className="text-2xl font-bold text-[#008080] mt-1">{value}</h3>
          </div>
        </div>
        <div className={trendColors[trend]}>
          {change}
        </div>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const activities = [
    { id: 1, type: 'registration', user: 'John Doe', event: 'Mumbai Olympics 2024', time: '2 minutes ago' },
    { id: 2, type: 'payment', user: 'Jane Smith', event: 'Delhi Games', time: '5 minutes ago' },
    { id: 3, type: 'event', user: 'Admin', event: 'New event created', time: '10 minutes ago' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-[#008080] mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-4 bg-[#F0E68C] bg-opacity-10 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 rounded-full bg-[#E97451]" />
              <div>
                <p className="font-medium text-[#008080]">{activity.user}</p>
                <p className="text-sm text-[#8B8B83]">{activity.event}</p>
              </div>
            </div>
            <span className="text-sm text-[#8B8B83]">{activity.time}</span>
          </div>
        ))}
      </div>
      <Button variant="ghost" fullWidth className="mt-4">
        View All Activity
      </Button>
    </div>
  );
};

export default function AdminDashboard() {
  const { user } = useUser();

  const stats = [
    {
      title: 'Total Registrations',
      value: '1,234',
      change: '+12.3%',
      icon: <UsersIcon className="h-6 w-6 text-[#008080]" />,
      trend: 'up' as const,
    },
    {
      title: 'Active Events',
      value: '15',
      change: '+2',
      icon: <CalendarIcon className="h-6 w-6 text-[#008080]" />,
      trend: 'up' as const,
    },
    {
      title: 'Revenue',
      value: '₹2.4L',
      change: '+8.1%',
      icon: <CurrencyRupeeIcon className="h-6 w-6 text-[#008080]" />,
      trend: 'up' as const,
    },
    {
      title: 'Cities',
      value: '8',
      change: 'No change',
      icon: <MapPinIcon className="h-6 w-6 text-[#008080]" />,
      trend: 'neutral' as const,
    },
    {
      title: 'Games',
      value: '24',
      change: '+3',
      icon: <TrophyIcon className="h-6 w-6 text-[#008080]" />,
      trend: 'up' as const,
    },
    {
      title: 'Conversion Rate',
      value: '68%',
      change: '-2.3%',
      icon: <ChartBarIcon className="h-6 w-6 text-[#008080]" />,
      trend: 'down' as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#008080]">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-[#8B8B83] mt-1">
              Here's what's happening with your events today.
            </p>
          </div>
          <Button variant="primary" size="lg">
            Create New Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#008080] mb-4">Registration Trends</h2>
            {/* Add your chart component here */}
            <div className="h-64 bg-[#F0E68C] bg-opacity-10 rounded-lg flex items-center justify-center">
              Chart Component Placeholder
            </div>
          </div>
          <RecentActivity />
        </div>
      </div>
    </AdminLayout>
  );
}
