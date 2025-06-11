'use client';

import { useState } from 'react';
import { ClipboardPaste, Trash2 } from 'lucide-react';

interface ConversationInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export default function ConversationInput({ onAnalyze, isAnalyzing }: ConversationInputProps) {
  const [text, setText] = useState('');

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      // You could show a toast or alert to the user here
    }
  };

  const handleClear = () => {
    setText('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-400">
        Input Conversation
      </h3>
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your conversation here...\n\nExample:\nUser 1: The sky is blue.\nUser 2: No, it's green."
          className="w-full h-64 p-4 bg-gray-900/70 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-gray-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={handlePaste}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors"
            title="Paste from clipboard"
          >
            <ClipboardPaste size={18} />
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-2 bg-gray-700 hover:bg-red-500/50 rounded-md text-gray-300 transition-colors"
            title="Clear text"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
       <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={isAnalyzing || !text.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-semibold transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Analyze Conversation'
              )}
            </button>
          </div>
    </form>
  );
} 