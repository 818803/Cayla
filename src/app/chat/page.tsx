'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function NewChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Create a new session ID and redirect to the dynamic chat page
    const newSessionId = uuidv4();
    router.replace(`/chat/${newSessionId}`);
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-sakura-bg">
      <div className="text-sakura-dark">Starting a new conversation...</div>
    </div>
  );
} 