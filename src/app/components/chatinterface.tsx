'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  className?: string;
  onSendMessage?: (message: string) => Promise<string>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  className = '', 
  onSendMessage 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hi! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const aiResponses = [
    "That's a great question! Let me think about that for a moment.",
    "I understand what you're looking for. Here's what I can tell you about that topic.",
    "Interesting perspective! I'd be happy to help you explore this further.",
    "I see what you mean. Let me provide you with some insights on this.",
    "That's something I can definitely help you with. Here's my take on it.",
    "Good point! I think you'll find this information useful.",
    "I appreciate you asking about this. Let me share what I know.",
    "That's a fascinating topic to discuss. Here are some thoughts I have.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      let aiResponse: string;
      
      if (onSendMessage) {
        aiResponse = await onSendMessage(trimmedInput);
      } else {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className={`flex flex-col h-full max-h-screen ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 px-8 py-6 bg-white/70 backdrop-blur-lg rounded-t-3xl shadow-lg border-b border-white/30">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
          🤖
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Assistant</h3>
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Online & Ready to Help
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container flex-1 flex flex-col overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 items-end ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow">
                AI
              </div>
            )}
            <div className={`chat-message ${message.isUser ? 'user' : 'bot'}`}>
              {message.content}
              <div className="text-xs text-gray-400 mt-1 text-right">{formatTime(message.timestamp)}</div>
            </div>
            {message.isUser && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow">
                You
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 items-end">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow">
              AI
            </div>
            <div className="chat-message bot flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={isLoading}
          className="chat-input resize-none"
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          className="chat-submit"
        >
          {isLoading ? (
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;