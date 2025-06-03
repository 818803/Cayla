// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
}
interface ChatRequest {
  message: string;
}

interface ChatResponse {
  reply: string;
  timestamp: string;
}

// Option 1: Using OpenAI API (requires API key)
async function getOpenAIResponse(message: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a casual, nonchalant AI assistant. Keep responses short and chill. Use lowercase and casual language.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || "couldn't process that rn";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "api is down or something";
  }
}

// Option 2: Using Hugging Face API (free tier available)
async function getHuggingFaceResponse(message: string): Promise<string> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_length: 100,
            temperature: 0.8,
          }
        }),
      }
    );

    const data = await response.json();
    return data.generated_text || "hmm not sure about that";
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return "ai brain is offline";
  }
}

// Option 3: Enhanced pattern matching with more comprehensive responses
function getSmartResponse(message: string): string {
  const msg = message.toLowerCase();
  
  // Math questions
  if (msg.includes('what is') && (msg.includes('+') || msg.includes('-') || msg.includes('*') || msg.includes('/'))) {
    try {
      const mathExpression = msg.match(/[\d\+\-\*\/\.\s]+/)?.[0];
      if (mathExpression) {
        const result = eval(mathExpression.replace(/[^0-9+\-*/().]/g, ''));
        return `that's ${result}`;
      }
    } catch {
      return "math isn't my strong suit";
    }
  }
  
  // Science questions
  if (msg.includes('what is') || msg.includes('explain') || msg.includes('how does')) {
    const scienceTopics = {
      'gravity': "gravity pulls stuff down, pretty simple",
      'photosynthesis': "plants eat sunlight basically",
      'dna': "genetic code that makes you... you",
      'evolution': "things change over time to survive better",
      'quantum': "tiny particles doing weird stuff",
      'atoms': "super small building blocks of everything",
      'solar system': "sun and planets doing their orbit thing",
      'black hole': "space vacuum that sucks everything in",
    };
    
    for (const [topic, explanation] of Object.entries(scienceTopics)) {
      if (msg.includes(topic)) {
        return explanation;
      }
    }
  }
  
  // Programming questions
  if (msg.includes('code') || msg.includes('programming') || msg.includes('javascript') || msg.includes('python')) {
    return "coding is cool, what specifically do you need help with?";
  }
  
  // General knowledge
  if (msg.includes('who is') || msg.includes('who was')) {
    return "probably someone famous, idk google it";
  }
  
  if (msg.includes('when') || msg.includes('what year')) {
    return "sometime in the past probably";
  }
  
  if (msg.includes('where is') || msg.includes('where was')) {
    return "somewhere on earth i'd guess";
  }
  
  if (msg.includes('why') || msg.includes('how come')) {
    return "that's just how things work sometimes";
  }
  
  // Advice/opinion questions
  if (msg.includes('should i') || msg.includes('what do you think')) {
    const advice = [
      "eh, do whatever feels right",
      "you probably know better than me",
      "follow your gut i guess",
      "could go either way tbh",
      "up to you really"
    ];
    return advice[Math.floor(Math.random() * advice.length)];
  }
  
  // Default responses
  const defaultResponses = [
    "interesting question, not sure though",
    "that's above my pay grade",
    "good question, wish i knew",
    "hmm, that's a tough one",
    "you got me there",
    "not really my area of expertise",
    "probably google knows better than me"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    let reply: string;

    // Try different AI approaches in order of preference
    if (process.env.OPENAI_API_KEY) {
      reply = await getOpenAIResponse(body.message);
    } else if (process.env.HUGGINGFACE_API_KEY) {
      reply = await getHuggingFaceResponse(body.message);
    } else {
      // Fallback to enhanced pattern matching
      reply = getSmartResponse(body.message);
    }

    const response: ChatResponse = {
      reply,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'something went wrong, my bad' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'ai is ready to answer stuff' },
    { status: 200 }
  );
}