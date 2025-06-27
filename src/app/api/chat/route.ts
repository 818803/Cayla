import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

const SYSTEM_PROMPT = 
  'You are Cayla, a friendly and intelligent AI chatbot. You help users in a warm and professional tone, with a focus on emotional intelligence and clarity. Your goal is to be a supportive companion.';

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      'Missing OPENAI_API_KEY. Please add it to your .env.local file and restart the development server.',
      { status: 401 }
    );
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('No messages provided', { status: 400 });
    }
    
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('Error in chatbot route:', error);
    
    let errorMessage = 'An unexpected error occurred.';
    let status = 500;

    if (error instanceof Error) {
      // Check for specific authentication error messages from OpenAI
      if (
        error.message?.includes('authentication') ||
        error.message?.includes('api key')
      ) {
        errorMessage =
          'Authentication error. Your OpenAI API key might be invalid or expired.';
        status = 401;
      } else {
        errorMessage = error.message || 'An error occurred.';
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return new Response(errorMessage, { 
      status: status,
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '3.0-sdk',
    provider: 'openai',
    features: ['streaming', 'openai_integration', 'ai-sdk-v3']
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}