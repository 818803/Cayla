// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  useLocalModel?: boolean;
}

interface ChatResponse {
  reply: string;
  timestamp: string;
  source: 'openai' | 'huggingface' | 'local' | 'fallback';
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "couldn't process that rn";
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
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

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    return data.generated_text || "hmm not sure about that";
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw error;
  }
}

// Option 3: Enhanced pattern matching with more comprehensive responses
function getSmartResponse(message: string): string {
  const msg = message.toLowerCase().trim();
  
  // Handle empty messages
  if (!msg) {
    return "you didn't say anything lol";
  }
  
  // Greetings
  if (msg.match(/^(hi|hello|hey|sup|what's up|yo)$/)) {
    const greetings = ["hey there", "sup", "hello", "yo what's good", "hey"];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // How are you
  if (msg.includes('how are you') || msg.includes('how you doing')) {
    return "i'm doing alright, just chillin. how about you?";
  }
  
  // Thanks
  if (msg.includes('thank') || msg.includes('thanks')) {
    return "no problem, glad i could help";
  }
  
  // Goodbye
  if (msg.match(/^(bye|goodbye|see you|later|peace)$/)) {
    return "catch you later";
  }
  
  // Math questions
  if (msg.includes('what is') && (msg.includes('+') || msg.includes('-') || msg.includes('*') || msg.includes('/'))) {
    try {
      const mathExpression = msg.match(/[\d\+\-\*\/\.\s]+/)?.[0];
      if (mathExpression) {
        // Safe math evaluation
        const sanitized = mathExpression.replace(/[^0-9+\-*/().]/g, '');
        const result = Function('"use strict"; return (' + sanitized + ')')();
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
        { reply: 'you need to actually say something', timestamp: new Date().toISOString(), source: 'fallback' as const },
        { status: 400 }
      );
    }

    // Add realistic delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    let reply: string;
    let source: ChatResponse['source'] = 'fallback';

    try {
      // Priority order for getting responses
      if (process.env.OPENAI_API_KEY) {
        reply = await getOpenAIResponse(body.message);
        source = 'openai';
      } else if (process.env.HUGGINGFACE_API_KEY) {
        reply = await getHuggingFaceResponse(body.message);
        source = 'huggingface';
      } else {
        // Fallback to pattern matching
        reply = getSmartResponse(body.message);
        source = 'fallback';
      }
    } catch (error) {
      console.error('Primary response method failed:', error);
      // Fallback to pattern matching
      reply = getSmartResponse(body.message);
      source = 'fallback';
    }

    const response: ChatResponse = {
      reply,
      timestamp: new Date().toISOString(),
      source
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        reply: 'something went wrong on my end, try again',
        timestamp: new Date().toISOString(),
        source: 'fallback' as const
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'ai is ready to answer stuff',
      availableSources: {
        openai: !!process.env.OPENAI_API_KEY,
        huggingface: !!process.env.HUGGINGFACE_API_KEY,
        local: false, // Disabled for now
        fallback: true
      }
    },
    { status: 200 }
  );
}