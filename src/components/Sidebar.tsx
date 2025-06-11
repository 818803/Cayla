'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  HeartHandshake,
  TrafficCone,
  Zap,
  Lock,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Scale,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, Conversation, deleteConversation } from '@/lib/conversation-history';

const featureItems = [
  { href: '/features/relationship-advice', icon: HeartHandshake, label: 'Relationship Advice' },
  { href: '/features/traffic-light', icon: TrafficCone, label: 'Traffic Light System' },
  { href: '/features/tone-analyzer', icon: Zap, label: 'Tone Analyzer' },
  { href: '/mediator', icon: Scale, label: 'AI Mediator' },
];

const resourcesItems = [
  { href: '/privacy', icon: Lock, label: 'Privacy Policy' },
];

type NavItemProps = {
  href: string;
  icon: React.ElementType;
  label: string;
  pathname: string;
};

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, pathname }) => {
  const isActive = pathname === href;
  return (
    <Link href={href} passHref>
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
          ${
            isActive
              ? 'bg-sakura-accent text-white shadow-lg shadow-sakura-accent/30'
              : 'text-sakura-dark hover:bg-sakura-bg'
          }`}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-sakura-accent'}`} />
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([]);

  useEffect(() => {
    const handleStorageChange = () => {
      setConversationHistory(getHistory());
    };
    
    // Initial load
    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

   useEffect(() => {
    // This allows the sidebar to be updated from other components
    const refreshHistory = () => setConversationHistory(getHistory());
    window.addEventListener('conversationHistoryChanged', refreshHistory);
    return () => window.removeEventListener('conversationHistoryChanged', refreshHistory);
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteConversation(id);
    setConversationHistory(getHistory()); // Immediate feedback
  };


  return (
     <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 0, x: isOpen ? 0 : -256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-shrink-0 bg-white border-r border-sakura-gray flex flex-col relative overflow-hidden"
    >
        <div className="w-64 h-full flex flex-col p-6">
          <div className="text-2xl font-bold text-sakura-dark mb-12">
            <Link href="/">Home</Link>
          </div>

          <nav className="flex-grow space-y-6">
            <div>
              <Link href="/chat" passHref>
                <div className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer bg-sakura-accent text-white shadow-lg shadow-sakura-accent/30 hover:bg-opacity-90">
                    <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">New Chat</span>
                    </div>
                    <PlusCircle className="h-5 w-5" />
                </div>
              </Link>
            </div>

            <div className="flex-grow overflow-y-auto -mr-4 pr-4">
              <button
                className="w-full flex justify-between items-center px-4 mb-2 text-sm font-semibold text-sakura-dark/50 uppercase tracking-wider"
                onClick={() => setHistoryOpen(!historyOpen)}
              >
                <span>Chat History</span>
                {historyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {historyOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-1 overflow-hidden"
                  >
                    {conversationHistory.map((item) => {
                      const isActive = pathname === `/chat/${item.id}`;
                      return (
                        <Link key={item.id} href={`/chat/${item.id}`} passHref>
                          <div className={`group flex justify-between items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200 ease-in-out ${isActive ? 'bg-sakura-bg text-sakura-accent font-semibold' : 'text-sakura-dark hover:bg-sakura-bg'}`}>
                            <span className="truncate flex-1">{item.title}</span>
                            <button onClick={(e) => handleDelete(e, item.id)} className="opacity-0 group-hover:opacity-100 text-sakura-dark/50 hover:text-red-500 transition-opacity">
                                <Trash2 size={14} />
                            </button>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <button
                className="w-full flex justify-between items-center px-4 mb-2 text-sm font-semibold text-sakura-dark/50 uppercase tracking-wider"
                onClick={() => setFeaturesOpen(!featuresOpen)}
              >
                <span>Features</span>
                {featuresOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {featuresOpen && (
                   <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-1 overflow-hidden"
                  >
                    {featureItems.map((item) => (
                      <NavItem key={item.href} {...item} pathname={pathname} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </nav>

          <div className="mt-auto">
            <h3 className="px-4 mb-2 text-sm font-semibold text-sakura-dark/50 uppercase tracking-wider">Resources</h3>
            {resourcesItems.map((item) => (
              <NavItem key={item.href} {...item} pathname={pathname} />
            ))}
          </div>
        </div>
    </motion.aside>
  );
} 