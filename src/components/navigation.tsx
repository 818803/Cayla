// components/Navigation.tsx
import Link from 'next/link';
import { Home, MessageCircle, User, Settings } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">My Website</h1>
          </div>
          
          {/* Navigation Icons */}
          <div className="flex space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <Home size={20} />
              <span className="hidden sm:block">Home</span>
            </Link>
            
            <Link 
              href="/chat" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <MessageCircle size={20} />
              <span className="hidden sm:block">Chat</span>
            </Link>
            
            <Link 
              href="/profile" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <User size={20} />
              <span className="hidden sm:block">Profile</span>
            </Link>
            
            <Link 
              href="/settings" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <Settings size={20} />
              <span className="hidden sm:block">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}