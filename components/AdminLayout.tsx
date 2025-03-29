import React, { ReactNode } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'NIBOG Admin Panel' }) => {
  const router = useRouter();

  const adminMenuItems = [
    { 
      href: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: <div className="h-5 w-5" />
    },
    { 
      href: '/admin/events', 
      label: 'Events', 
      icon: <div className="h-5 w-5" />
    },
    { 
      href: '/admin/cities', 
      label: 'Cities', 
      icon: <div className="h-5 w-5" />
    },
    { 
      href: '/admin/games', 
      label: 'Games', 
      icon: <div className="h-5 w-5" />
    },
    { 
      href: '/admin/registrations', 
      label: 'Registrations', 
      icon: <div className="h-5 w-5" />
    },
    { 
      href: '/admin/email-templates', 
      label: 'Email Templates', 
      icon: <div className="h-5 w-5" />
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-nibog-primary">NIBOG Admin</h1>
        </div>
        
        <SignedIn>
          <nav className="p-4">
            <ul className="space-y-2">
              {adminMenuItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`
                      flex items-center space-x-3 p-2 rounded 
                      ${router.pathname === item.href 
                        ? 'bg-nibog-primary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SignedIn>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-md p-4 flex justify-end items-center">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-nibog-primary text-white px-4 py-2 rounded">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
