'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { PanelLeft, PanelRight } from 'lucide-react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-sakura-bg dark:bg-gray-900 relative">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
              {isSidebarOpen ? <PanelLeft size={18} /> : <PanelRight size={18} />}
          </Button>
      </div>

      <main className="flex-grow relative transition-all duration-300 ease-in-out">
        <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
        </div>
        <div className="h-full w-full">
         {children}
        </div>
      </main>
    </div>
  );
} 