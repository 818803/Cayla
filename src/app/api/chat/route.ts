import { NextRequest, NextResponse } from 'next/server';
import { EnhancedChatbot } from '@/lib/ai-provider';
import { detectEmotion } from '@/lib/sentiment-analysis';

// This is a simplified in-memory store.
// In production, you would use a database or a service like Redis to store conversations per user.
const conversations = new Map<string, EnhancedChatbot>();

function getChatbot(sessionId: string): EnhancedChatbot {
  if (!conversations.has(sessionId)) {
    console.log(`Creating new chatbot session for ID: ${sessionId}`);
    const systemPrompt = "You are Cayla, a compassionate and understanding AI friend. Your purpose is to help teenagers navigate complex emotional situations. You are patient, non-judgmental, and insightful. You do not give direct advice, but instead, you help users explore their own feelings and perspectives by asking thoughtful questions and offering gentle reflections. You respond in a warm, conversational, and slightly informal tone, like a wise older sister or a good friend. Your goal is to provide clarity and emotional support.";
    
    const chatbot = new EnhancedChatbot({
      openaiKey: process.env.OPENAI_API_KEY || '',
      systemPrompt: systemPrompt,
    });
      
    conversations.set(sessionId, chatbot);
  }
  return conversations.get(sessionId)!;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const chatbot = getChatbot(sessionId);
    const response = await chatbot.processMessage(message);
    
    if (response.error) {
      console.error('Chat API Error from AI Provider:', response.error);
      return NextResponse.json({ error: response.message || 'Internal server error' }, { status: 500 });
    }

    const emotion = await detectEmotion(response.message);
    
    return NextResponse.json({ 
      reply: response.message,
      emotion: emotion,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() });
} 