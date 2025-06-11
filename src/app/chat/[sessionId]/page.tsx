'use client'

import { useState } from 'react';
import { useParams } from 'next/navigation';
import ChatInterface from '@/components/chatinterface';
import { ChatMessage, Emotion } from '@/lib/types';
import { saveConversation } from '@/lib/conversation-history';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('Normal');
  const params = useParams();
  const sessionId = params.sessionId as string;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: input,
      timestamp: new Date(),
    };
    
    // If this is the first user message, save it to history
    if (messages.filter(m => m.sender === 'user').length === 0) {
      const newTitle = input.substring(0, 30) + (input.length > 30 ? '...' : '');
      saveConversation(sessionId, newTitle);
      // Notify other components that history has changed
      window.dispatchEvent(new Event('conversationHistoryChanged'));
    }

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setCurrentEmotion(data.emotion || 'Normal');

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        message: data.reply,
        timestamp: new Date(),
        emotion: data.emotion,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setCurrentEmotion('Sad');
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        message: 'Sorry, I had trouble connecting. Please try again in a moment.',
        timestamp: new Date(),
        emotion: 'Sad'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
       <div className="w-full h-full md:p-4 flex justify-center items-center">
            <div className="w-full h-full max-w-2xl md:h-full md:max-h-[900px] flex flex-col bg-white dark:bg-gray-800 rounded-none md:rounded-4xl shadow-lg border border-sakura-gray dark:border-gray-700">
                <ChatInterface
                    messages={messages}
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    currentEmotion={currentEmotion}
                    className="h-full"
                />
            </div>
       </div>
    </div>
  );
} 