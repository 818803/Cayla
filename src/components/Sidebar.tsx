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
  Sparkles,
  Calendar,
  BookHeart,
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, Conversation, deleteConversation } from '@/lib/conversation-history';

const featureItems = [
  { href: '/features/relationship-advice', icon: HeartHandshake, label: 'Relationship Advice' },
  { href: '/features/traffic-light', icon: TrafficCone, label: 'Traffic Light System' },
  { href: '/features/tone-analyzer', icon: Zap, label: 'Response' },
  { href: '/mediator', icon: Scale, label: 'AI Mediator' },
];

const motivationItems = [
  { href: '/features/motivation', icon: Sparkles, label: 'Get a Boost' },
];

const planningItems = [
  { href: '/features/planning', icon: Calendar, label: 'My Calendar' },
];

const selfReflectionItems = [
  { href: '/features/self-reflection', icon: BookHeart, label: 'My Journal' },
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
        className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ease-in-out
          ${
            isActive
              ? 'bg-sakura-accent text-white shadow-md shadow-sakura-accent/30'
              : 'text-sakura-dark hover:bg-sakura-bg'
          }`}
      >
        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-sakura-accent'}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [motivationOpen, setMotivationOpen] = useState(true);
  const [planningOpen, setPlanningOpen] = useState(true);
  const [reflectionOpen, setReflectionOpen] = useState(true);
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
        <div className="w-64 h-full flex flex-col p-4">
          <div className="text-xl font-bold text-sakura-dark mb-8">
            <Link href="/">Xin AI (心爱)</Link>
          </div>

          <nav className="flex-grow space-y-4">
            <div>
              <Link href="/chat" passHref>
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer bg-sakura-accent text-white shadow-lg shadow-sakura-accent/30 hover:bg-opacity-90">
                    <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">New Chat</span>
                    </div>
                    <PlusCircle className="h-5 w-5" />
                </div>
              </Link>
            </div>

            <div className="flex-grow overflow-y-auto -mr-3 pr-3">
              <button
                className="w-full flex justify-between items-center px-3 mb-1 text-xs font-semibold text-sakura-dark/50 uppercase tracking-wider"
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
                    className="space-y-0.5 overflow-hidden"
                  >
                    {conversationHistory.map((item) => {
                      const isActive = pathname === `/chat/${item.id}`;
                      return (
                        <Link key={item.id} href={`/chat/${item.id}`} passHref>
                          <div className={`group flex justify-between items-center space-x-2 px-3 py-1.5 rounded-md cursor-pointer text-xs transition-all duration-200 ease-in-out ${isActive ? 'bg-sakura-bg text-sakura-accent font-semibold' : 'text-sakura-dark hover:bg-sakura-bg'}`}>
                            <span className="truncate flex-1">{item.title}</span>
                            <button onClick={(e) => handleDelete(e, item.id)} className="opacity-0 group-hover:opacity-100 text-sakura-dark/50 hover:text-red-500 transition-opacity">
                                <Trash2 size={12} />
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
                className="w-full flex justify-between items-center px-3 mb-1 text-xs font-semibold text-sakura-dark/50 uppercase tracking-wider"
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
                    className="space-y-0.5 overflow-hidden"
                  >
                    {featureItems.map((item) => (
                      <NavItem key={item.href} {...item} pathname={pathname} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <button
                className="w-full flex justify-between items-center px-3 mb-1 text-xs font-semibold text-sakura-dark/50 uppercase tracking-wider"
                onClick={() => setMotivationOpen(!motivationOpen)}
              >
                <span>Motivation</span>
                {motivationOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {motivationOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-0.5 overflow-hidden"
                  >
                    {motivationItems.map((item) => (
                      <NavItem key={item.href} {...item} pathname={pathname} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <button
                className="w-full flex justify-between items-center px-3 mb-1 text-xs font-semibold text-sakura-dark/50 uppercase tracking-wider"
                onClick={() => setPlanningOpen(!planningOpen)}
              >
                <span>Planning</span>
                {planningOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {planningOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-0.5 overflow-hidden"
                  >
                    {planningItems.map((item) => (
                      <NavItem key={item.href} {...item} pathname={pathname} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <button
                className="w-full flex justify-between items-center px-3 mb-1 text-xs font-semibold text-sakura-dark/50 uppercase tracking-wider"
                onClick={() => setReflectionOpen(!reflectionOpen)}
              >
                <span>Self Reflection</span>
                {reflectionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {reflectionOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-0.5 overflow-hidden"
                  >
                    {selfReflectionItems.map((item) => (
                      <NavItem key={item.href} {...item} pathname={pathname} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </nav>

          <div className="mt-auto">
            <h3 className="px-3 mb-1 text-xs font-semibold text-sakura-dark/50 uppercase tracking-wider">Resources</h3>
            {resourcesItems.map((item) => (
              <NavItem key={item.href} {...item} pathname={pathname} />
            ))}
          </div>
        </div>
    </motion.aside>
  );
} 