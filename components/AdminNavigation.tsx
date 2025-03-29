import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  CalendarIcon, 
  GamepadIcon, 
  MapPinIcon, 
  SettingsIcon 
} from 'lucide-react';

const AdminNavigation: React.FC = () => {
  const router = useRouter();

  const navItems = [
    { 
      href: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: HomeIcon 
    },
    { 
      href: '/admin/events', 
      label: 'Events', 
      icon: CalendarIcon 
    },
    { 
      href: '/admin/games', 
      label: 'Games', 
      icon: GamepadIcon 
    },
    { 
      href: '/admin/cities', 
      label: 'Cities', 
      icon: MapPinIcon 
    },
    { 
      href: '/admin/settings', 
      label: 'Settings', 
      icon: SettingsIcon 
    }
  ];

  return (
    <nav className="bg-white shadow-md p-4 w-64">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-nibog-primary">Admin Panel</h2>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`
                  flex items-center p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-nibog-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="mr-3" size={20} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminNavigation;
