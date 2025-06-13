'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/lib/types';
import { avatarMap } from '@/lib/sentiment-analysis';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error?: string | null;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const form = event.currentTarget.form;
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }
  };

  const currentAvatar = avatarMap['Normal'];

  return (
    <div className={`flex flex-col h-full max-h-screen bg-white dark:bg-gray-800 rounded-4xl ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 rounded-t-4xl border-b border-sakura-gray dark:border-gray-700">
        <div className="w-12 h-12 bg-gradient-to-br from-sakura-pink to-sakura-accent rounded-full flex-shrink-0 relative overflow-hidden ring-4 ring-white dark:ring-gray-800">
          <Image
            src={currentAvatar}
            alt="Cayla Avatar"
            fill
            sizes="48px"
            style={{ objectFit: 'cover' }}
            priority
            key={currentAvatar} // Add key to force re-render on change
          />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sakura-text dark:text-gray-100">Chat with Cayla</h1>
          <p className="text-sm text-sakura-text/70 dark:text-gray-400">Your private AI guide for emotional clarity</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((m) => {
          const avatarSrc = avatarMap['Normal'];
          return (
            <div key={m.id} className={`flex items-end gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'bot' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sakura-pink to-sakura-accent flex-shrink-0 self-start">
                  <Image src={avatarSrc} alt="Cayla Avatar" width={36} height={36} className="rounded-full" />
                </div>
              )}
              <div className={`px-4 py-2.5 rounded-2xl max-w-lg shadow-sm prose dark:prose-invert ${m.sender === 'user' 
                ? 'bg-sakura-accent text-white rounded-br-none' 
                : 'bg-sakura-gray text-sakura-text dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'
              }`}>
                <ReactMarkdown>{m.message}</ReactMarkdown>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-end gap-3 justify-start">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sakura-pink to-sakura-dark-pink flex-shrink-0">
               <Image src={currentAvatar} alt="Cayla Avatar" width={36} height={36} className="rounded-full" />
            </div>
            <div className="p-4 rounded-2xl max-w-md shadow-sm bg-sakura-gray text-sakura-text dark:bg-gray-700 rounded-bl-none">
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-sakura-pink rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-sakura-pink rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-sakura-pink rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-sakura-gray dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-4xl">
        {error && (
          <div className="mb-2 text-center text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
            <p><strong>API Error:</strong> {error}</p>
            <p className="text-xs text-red-400 mt-1">Please check your OPENAI_API_KEY in .env.local and restart the server.</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message, Cayla is listening..."
            rows={1}
            className="flex-1 p-3 bg-sakura-gray dark:bg-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sakura-accent transition-all text-sakura-text dark:text-gray-200 placeholder:text-sakura-text/50 dark:placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-sakura-accent text-white rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-md hover:shadow-pink-glow"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;