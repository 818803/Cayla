'use client'

import { useState, useEffect, useMemo } from 'react';
import { useChat } from 'ai/react';
import { useParams } from 'next/navigation';
import ChatInterface from '@/components/chatinterface';
import { getConversation, saveConversation } from '@/lib/conversation-history';
import { Emotion, ChatMessage as UIChatMessage } from '@/lib/types';
import { type Message as CoreMessage } from 'ai/react';

function transformToUIMessages(messages: CoreMessage[], emotionMap: Map<string, Emotion>): UIChatMessage[] {
  return messages.map((msg) => ({
    id: msg.id,
    message: msg.content,
    sender: msg.role === 'user' ? 'user' : 'bot',
    emotion: msg.role === 'assistant' ? emotionMap.get(msg.id) || 'Normal' : undefined,
    timestamp: msg.createdAt || new Date(),
  }));
}

export default function ChatPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('Normal');
  const [emotionMap, setEmotionMap] = useState<Map<string, Emotion>>(new Map());
  const [initialMessages, setInitialMessages] = useState<CoreMessage[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  useEffect(() => {
    if (sessionId && !isHistoryLoaded) {
      const conversation = getConversation(sessionId);
      if (conversation) {
        setInitialMessages(conversation.messages);
      }
      setIsHistoryLoaded(true);
    }
  }, [sessionId, isHistoryLoaded]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: '/api/chat',
    id: sessionId,
    initialMessages: initialMessages,
    onResponse: (response) => {
      const emotion = response.headers.get('X-Emotion') as Emotion | null;
      if (emotion) {
        setCurrentEmotion(emotion);
      }
    },
    onFinish: (message) => {
      setEmotionMap(prev => new Map(prev).set(message.id, currentEmotion));
    }
  });
  
  useEffect(() => {
    if (isHistoryLoaded && initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [isHistoryLoaded, initialMessages, messages, setMessages]);

  useEffect(() => {
    if (sessionId && messages.length > 0 && !isLoading) {
      const firstUserMessage = messages.find(m => m.role === 'user');
      const conversation = getConversation(sessionId);
      const title = conversation?.title || (firstUserMessage ? firstUserMessage.content.substring(0, 30) : 'New Chat');
      saveConversation(sessionId, title, messages);

      if(messages.length > (conversation?.messages.length || 0)) {
        window.dispatchEvent(new Event('conversationHistoryChanged'));
      }
    }
  }, [messages, sessionId, isLoading]);
  
  const uiMessages = useMemo(() => transformToUIMessages(messages, emotionMap), [messages, emotionMap]);

  if (!isHistoryLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-sakura-bg">
        <div className="text-sakura-dark">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ChatInterface
        messages={uiMessages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        currentEmotion={currentEmotion}
        error={error?.message}
        className="h-full w-full"
      />
    </div>
  );
} 