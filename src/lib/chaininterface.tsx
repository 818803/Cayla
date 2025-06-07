'use client'

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/chatinterface';import { Moon, Sun, Sparkles, MessageCircle, Zap, Shield } from 'lucide-react';
export default function ChatPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    setIsLoaded(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

const handleSendMessage = async (message: string): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    
    // Handle both success and error responses that contain a 'reply' field
    if (data.reply) {
      return data.reply;
    }
    
    // Fallback for unexpected response format
    return data.message || "I'm sorry, I didn't understand that.";
    
  } catch (error) {
    console.error('Error:', error);
    return "I'm experiencing some technical difficulties. Please try again.";
  }
};

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-all duration-700 ease-out relative overflow-hidden"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f1629 50%, #020617 100%)' 
          : 'linear-gradient(135deg, #fafafa 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 100%)'
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: isDarkMode 
            ? 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)'
        }}></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4 group">
              <div 
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)' 
                    : 'linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #22d3ee 100%)',
                  boxShadow: isDarkMode 
                    ? '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                    : '0 8px 32px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                <Sparkles className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 
                  className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300"
                  style={{
                    backgroundImage: isDarkMode 
                      ? 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)' 
                      : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)'
                  }}
                >
                  Cayala
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: isDarkMode ? '#10b981' : '#059669' }}
                  >
                    Online & Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="hidden md:flex items-center space-x-3">
              <div 
                className="flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: isDarkMode 
                    ? 'rgba(15, 23, 42, 0.6)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  border: `1px solid ${isDarkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)'}`
                }}
              >
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium" style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                  Fast Response
                </span>
              </div>
              <div 
                className="flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: isDarkMode 
                    ? 'rgba(15, 23, 42, 0.6)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  border: `1px solid ${isDarkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)'}`
                }}
              >
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium" style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                  Secure
                </span>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #374151 0%, #4b5563 100%)' 
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
              aria-label="Toggle theme"
            >
              <div className="relative">
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 group-hover:rotate-12" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600 transition-transform duration-300 group-hover:-rotate-12" />
                )}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Chat Container */}
      <main className="relative z-10 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className="relative overflow-hidden transition-all duration-700 border backdrop-blur-2xl group"
            style={{
              height: 'calc(100vh - 180px)',
              background: isDarkMode 
                ? 'rgba(15, 23, 42, 0.8)' 
                : 'rgba(255, 255, 255, 0.85)',
              borderColor: isDarkMode 
                ? 'rgba(51, 65, 85, 0.3)' 
                : 'rgba(226, 232, 240, 0.4)',
              borderRadius: '24px',
              boxShadow: isDarkMode 
                ? '0 32px 64px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                : '0 32px 64px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
            }}
          >
            {/* Glass reflection effect */}
            <div 
              className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-80"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)' 
                  : 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)'
              }}
            ></div>

            {/* Enhanced Chat Header */}
            <header 
              className="relative px-8 py-6 border-b backdrop-blur-xl"
              style={{
                background: isDarkMode 
                  ? 'rgba(30, 41, 59, 0.4)' 
                  : 'rgba(248, 250, 252, 0.6)',
                borderColor: isDarkMode 
                  ? 'rgba(51, 65, 85, 0.2)' 
                  : 'rgba(226, 232, 240, 0.3)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                        : 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <MessageCircle className="w-6 h-6 text-white" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h2 
                      className="text-xl font-bold mb-1"
                      style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
                    >
                      Cayala
                    </h2>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span 
                          className="text-sm font-medium"
                          style={{ color: isDarkMode ? '#10b981' : '#059669' }}
                        >
                          Active Now
                        </span>
                      </div>
                      <div 
                        className="h-3 w-px"
                        style={{ backgroundColor: isDarkMode ? '#374151' : '#e2e8f0' }}
                      ></div>
                      <span 
                        className="text-sm"
                        style={{ color: isDarkMode ? '#64748b' : '#64748b' }}
                      >
                        Powered by Advanced AI
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Status Indicators */}
                <div className="flex items-center space-x-4">
                  <div 
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full"
                    style={{
                      background: isDarkMode 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(16, 185, 129, 0.1)',
                      border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                    }}
                  >
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span 
                      className="text-xs font-semibold"
                      style={{ color: isDarkMode ? '#10b981' : '#059669' }}
                    >
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            </header>
            
            {/* Chat Interface */}
            <div className="relative h-full">
              <ChatInterface 
                onSendMessage={handleSendMessage}
                className="w-full h-full"
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Orbs */}
        <div 
          className="absolute top-32 -left-32 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 animate-float"
          style={{
            background: isDarkMode 
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)' 
              : 'radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 100%)',
            animationDelay: '0s'
          }}
        ></div>
        
        <div 
          className="absolute bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl transition-all duration-1000 animate-float-reverse"
          style={{
            background: isDarkMode 
              ? 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 100%)' 
              : 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(96, 165, 250, 0.12) 50%, transparent 100%)',
            animationDelay: '2s'
          }}
        ></div>

        <div 
          className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full blur-3xl transition-all duration-1000 animate-pulse-gentle"
          style={{
            background: isDarkMode 
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)' 
              : 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)',
            animationDelay: '1s'
          }}
        ></div>

        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: isDarkMode 
              ? 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)' 
              : 'radial-gradient(circle at 2px 2px, rgba(148,163,184,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(20px) translateX(-10px); }
          50% { transform: translateY(10px) translateX(10px); }
          75% { transform: translateY(30px) translateX(-5px); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}