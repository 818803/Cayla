'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  source?: 'openai' | 'huggingface' | 'local' | 'fallback' | 'error';
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
      timestamp: new Date(),
      source: 'local'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalModel, setUseLocalModel] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    openai: boolean;
    huggingface: boolean;
    local: boolean;
    fallback: boolean;
  } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/chat', { method: 'GET' });
      const data = await response.json();
      setApiStatus(data.availableSources || null);
    } catch (error) {
      console.error('Failed to check API status:', error);
    }
  };

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

  const getSourceBadge = (source?: string) => {
    if (!source) return null;
    
    const badges = {
      openai: { text: 'GPT', color: 'bg-green-500' },
      huggingface: { text: 'HF', color: 'bg-yellow-500' },
      local: { text: 'Local', color: 'bg-blue-500' },
      fallback: { text: 'Pattern', color: 'bg-gray-500' },
      error: { text: 'Error', color: 'bg-red-500' }
    };

    const badge = badges[source as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`inline-block px-2 py-1 text-xs text-white rounded-full ${badge.color} ml-2`}>
        {badge.text}
      </span>
    );
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const sendMessageToAPI = async (message: string, useLocal = false) => {
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          useLocalModel: useLocal
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        reply: data.reply,
        timestamp: data.timestamp,
        source: data.source
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        reply: "sorry, something went wrong on my end",
        timestamp: new Date().toISOString(),
        source: 'error'
      };
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
      let aiResponse: { reply: string; source: string };
      
      if (onSendMessage) {
        // Use custom onSendMessage if provided
        const reply = await onSendMessage(trimmedInput);
        aiResponse = { reply, source: 'custom' };
      } else {
        // Use your API endpoint
        aiResponse = await sendMessageToAPI(trimmedInput, useLocalModel);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.reply,
        isUser: false,
        timestamp: new Date(),
        source: aiResponse.source as Message['source']
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
        source: 'error'
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
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Assistant</h3>
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Online & Ready to Help
            {apiStatus && (
              <div className="flex gap-1 ml-2">
                {apiStatus.openai && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">GPT</span>}
                {apiStatus.huggingface && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">HF</span>}
                {apiStatus.local && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Local</span>}
              </div>
            )}
          </div>
        </div>
        
        {/* Model Toggle */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Force Local Model:
          </label>
          <button
            onClick={() => setUseLocalModel(!useLocalModel)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useLocalModel ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useLocalModel ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
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
              <div className="flex items-start justify-between">
                <span className="flex-1">{message.content}</span>
                {!message.isUser && getSourceBadge(message.source)}
              </div>
              <div className="text-xs text-gray-400 mt-1 text-right">
                {formatTime(message.timestamp)}
              </div>
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
          placeholder={`Type your message here${useLocalModel ? ' (using local model)' : ''}...`}
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