'use client';

import { useCompletion } from 'ai/react';
import { useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function InstantReliefPage() {
  const [prompt, setPrompt] = useState('');
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/instant-relief',
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // We pass the user's input to the useCompletion hook
    handleSubmit(e, { prompt });
  };
  
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
            <div className="inline-block bg-pink-100 p-4 rounded-full">
                <Zap className="w-10 h-10 text-pink-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mt-4">Instant Relief</h1>
            <p className="text-lg text-gray-500 mt-2">Feeling overwhelmed, stressed, or down? Tell us what's on your mind, and get a quick, actionable suggestion to feel better right now.</p>
        </div>
        
        <form onSubmit={handleFormSubmit}>
            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => {
                        handleInputChange(e);
                        setPrompt(e.target.value);
                    }}
                    placeholder="e.g., 'I had a fight with my friend' or 'I'm feeling unmotivated to work'"
                    rows={3}
                    className="w-full p-4 pr-24 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-gray-800 placeholder:text-gray-400"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute top-1/2 right-3 -translate-y-1/2 px-5 py-2 bg-pink-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                    <Sparkles size={16} />
                    Get Advice
                </button>
            </div>
        </form>

        {(isLoading || completion) && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Quick Relief Plan:</h2>
            <div className="prose prose-lg max-w-none prose-pink">
              {isLoading && !completion && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-300"></div>
                  <span className="text-gray-500">Thinking of the perfect thing for you...</span>
                </div>
              )}
              {completion && <ReactMarkdown>{completion}</ReactMarkdown>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 