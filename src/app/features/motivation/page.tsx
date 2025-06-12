'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type MotivationType = 'positive' | 'tough';

export default function MotivationPage() {
  const [motivationType, setMotivationType] = useState<MotivationType | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getMotivation = async (type: MotivationType) => {
    setMotivationType(type);
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/motivation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch motivation');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-8 bg-sakura-bg dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-2xl mx-auto text-center">
        <Sparkles className="mx-auto h-12 w-12 text-sakura-accent" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-sakura-text dark:text-white sm:text-5xl">
          Need a Boost?
        </h1>
        <p className="mt-6 text-lg leading-8 text-sakura-text/80 dark:text-gray-300">
          Choose the kind of motivation you need right now. Cayla's here to give you the push you're looking for.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => getMotivation('positive')} size="lg" className="bg-green-500 hover:bg-green-600">
            <Heart className="mr-2 h-5 w-5" />
            Positive Reinforcement
          </Button>
          <Button onClick={() => getMotivation('tough')} size="lg" variant="destructive" className="bg-red-600 hover:bg-red-700">
            <Zap className="mr-2 h-5 w-5" />
            Tough Love
          </Button>
        </div>

        <div className="mt-12 min-h-[150px] bg-white dark:bg-gray-800 rounded-2xl shadow-inner p-8 flex items-center justify-center">
          {isLoading && <Loader2 className="h-8 w-8 animate-spin text-sakura-accent" />}
          
          {message && (
             <motion.p 
                key={message}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-medium text-sakura-text dark:text-gray-200"
              >
               {message}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
} 