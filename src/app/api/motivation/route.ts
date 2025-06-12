import { NextRequest, NextResponse } from 'next/server';
import { EnhancedChatbot } from '@/lib/ai-provider';

function getMotivationPrompt(type: 'positive' | 'tough'): string {
    if (type === 'tough') {
        return "You are a tough-love motivational coach. Your goal is to give a user a short, powerful, no-excuses message to get them motivated. It should be direct, blunt, and inspiring. Focus on action and overcoming self-doubt. The user needs a kick in the pants. Generate a single motivational phrase or a 2-3 sentence paragraph.";
    }
    // Default to positive
    return "You are a kind and compassionate motivational coach. Your goal is to give a user a short, powerful, and uplifting message. It should be full of encouragement, self-love, and belief in their potential. The user needs gentle and positive reinforcement. Generate a single motivational phrase or a 2-3 sentence paragraph.";
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type !== 'positive' && type !== 'tough') {
      return NextResponse.json({ error: 'Invalid motivation type specified' }, { status: 400 });
    }

    const systemPrompt = getMotivationPrompt(type);
    
    const chatbot = new EnhancedChatbot({
      openaiKey: process.env.OPENAI_API_KEY || '',
      systemPrompt: systemPrompt,
    });
      
    const response = await chatbot.processMessage("Give me a motivational message.");

    if (response.error) {
      console.error('Motivation API Error from AI Provider:', response.error);
      return NextResponse.json({ error: response.message || 'Internal server error' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: response.message,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Motivation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 