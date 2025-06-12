'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookHeart, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const prompts = [
    "What was the high point of my day? What was the low point?",
    "What is one thing I'm grateful for today?",
    "What's one thing I learned today, about myself or the world?",
    "How did I show kindness to myself or others today?",
    "What's a challenge I faced today, and how did I handle it?",
    "What's on my mind right now? Let me just write freely.",
    "What is one thing I can do tomorrow to make it a better day?"
];

export default function SelfReflectionPage() {
  const [reflection, setReflection] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  const getNewPrompt = () => {
    const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(newPrompt);
  };

  const handleSave = () => {
    // In a real app, you'd save this to a database or local storage.
    alert('Your reflection has been saved! (This is a demo feature)');
    setReflection('');
  }

  return (
    <div className="w-full h-full p-8 bg-sakura-bg dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
            <BookHeart className="mx-auto h-12 w-12 text-sakura-accent" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-sakura-text dark:text-white sm:text-5xl">
            A Moment for Myself
            </h1>
            <p className="mt-6 text-lg leading-8 text-sakura-text/80 dark:text-gray-300">
            Use this space to privately journal your thoughts and feelings.
            </p>
        </div>

        <div className="mt-10 p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-sakura-text dark:text-gray-200">Reflection Prompt</h3>
                <Button variant="ghost" size="icon" onClick={getNewPrompt}>
                    <RefreshCw className="h-4 w-4 text-sakura-accent" />
                </Button>
            </div>
             <motion.p 
                key={currentPrompt}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-sakura-bg dark:bg-gray-700/50 rounded-lg text-sakura-text/90 dark:text-gray-300"
              >
               {currentPrompt}
            </motion.p>

            <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Start writing..."
                rows={10}
                className="w-full p-3 bg-sakura-gray dark:bg-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sakura-accent transition-all text-sakura-text dark:text-gray-200 placeholder:text-sakura-text/50 dark:placeholder:text-gray-400"
            />
            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={!reflection.trim()}>
                    Save Reflection
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
} 