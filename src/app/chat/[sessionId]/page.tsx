'use client'

import { useMemo } from 'react';
import { useChat } from 'ai/react';
import { useParams } from 'next/navigation';
import ChatInterface from '@/components/chatinterface';
import { getConversation, saveConversation } from '@/lib/conversation-history';
import { ChatMessage as UIChatMessage } from '@/lib/types';
import { type Message as CoreMessage } from 'ai/react';

function transformToUIMessages(messages: CoreMessage[]): UIChatMessage[] {
  return messages.map((msg) => ({
    id: msg.id,
    message: msg.content,
    sender: msg.role === 'user' ? 'user' : 'bot',
    timestamp: msg.createdAt || new Date(),
  }));
}

export default function ChatPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  // Fetch initial messages directly
  const conversation = getConversation(sessionId);
  const initialMessages = conversation ? conversation.messages : [];

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    id: sessionId,
    initialMessages: initialMessages,
    onFinish: (message) => {
      // Create a snapshot of the messages to save
      const messagesToSave = [...messages, message];
      const firstUserMessage = messagesToSave.find(m => m.role === 'user');
      const title = conversation?.title || (firstUserMessage ? firstUserMessage.content.substring(0, 30) : 'New Chat');
      saveConversation(sessionId, title, messagesToSave);
      window.dispatchEvent(new Event('conversationHistoryChanged'));
    }
  });
  
  const uiMessages = useMemo(() => transformToUIMessages(messages), [messages]);

  return (
    <div className="h-full w-full">
      <ChatInterface
        messages={uiMessages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error?.message}
        className="h-full w-full"
      />
    </div>
  );
} 