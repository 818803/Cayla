import { EnhancedChatbot } from '@/lib/ai-provider';

export const runtime = 'edge';

// Enhanced response patterns with more variety
const responsePatterns = {
  greetings: {
    patterns: [/^(hi|hello|hey|good morning|good afternoon|good evening)/i],
    responses: [
      "Hello! How can I help you today?",
      "Hi there! What's on your mind?",
      "Hey! Great to see you. What can I do for you?",
      "Good to meet you! How are you doing?",
      "Hello! I'm here and ready to chat. What's up?"
    ],
    emotion: 'Joy'
  },
  
  questions: {
    patterns: [/\?$/, /^(what|how|why|when|where|who|which|can you|could you|would you)/i],
    responses: [
      "That's a great question! Let me think about that...",
      "Interesting question! I'd love to explore that with you.",
      "Good point! Here's what I think about that...",
      "That's something worth discussing! My take is...",
      "I appreciate you asking! From my perspective...",
      "That's a thoughtful question! Let me share some insights..."
    ],
    emotion: 'Curiosity'
  },
  
  compliments: {
    patterns: [/^(you're|you are).*(great|amazing|awesome|good|nice|helpful|smart)/i, 
               /(thank you|thanks|appreciate)/i],
    responses: [
      "Thank you so much! That really means a lot to me.",
      "I appreciate your kind words! I'm here to help.",
      "That's very thoughtful of you to say!",
      "Thank you! I'm glad I could be helpful.",
      "Your appreciation makes my day! Happy to assist.",
      "Thanks for the feedback! I'm doing my best to help."
    ],
    emotion: 'Gratitude'
  },
  
  problems: {
    patterns: [/(problem|issue|error|bug|broken|not working|help me|stuck)/i],
    responses: [
      "I understand you're facing a challenge. Let's work through this together.",
      "No worries! Problems happen. What exactly seems to be the issue?",
      "I'm here to help! Can you tell me more about what's not working?",
      "Let's troubleshoot this step by step. What's going wrong?",
      "I can definitely help with that! What specific problem are you encountering?",
      "Don't worry, we'll figure this out! What seems to be the main issue?"
    ],
    emotion: 'Concern'
  },
  
  coding: {
    patterns: [/(code|coding|programming|javascript|python|react|bug|function|variable|array|object)/i],
    responses: [
      "I love talking about code! What programming challenge are you working on?",
      "Programming can be tricky sometimes. What language are you using?",
      "Coding is fun! What kind of project are you building?",
      "I'd be happy to help with your coding question! What's the context?",
      "Great! Let's dive into some code. What specifically do you need help with?",
      "Programming problems are puzzles waiting to be solved! What's your challenge?"
    ],
    emotion: 'Excitement'
  },
  
  personal: {
    patterns: [/(how are you|feeling|mood|doing|yourself)/i],
    responses: [
      "I'm doing well, thank you for asking! How about you?",
      "I'm feeling great and ready to help! How are you today?",
      "I'm in a good mood and excited to chat! What's going on with you?",
      "I'm doing wonderfully! Thanks for checking in. How are things with you?",
      "I'm feeling positive and energetic! How has your day been?",
      "I'm doing great, thanks! I hope you're having a good day too!"
    ],
    emotion: 'Contentment'
  },
  
  goodbyes: {
    patterns: [/(bye|goodbye|see you|talk later|take care|farewell)/i],
    responses: [
      "Goodbye! It was great chatting with you!",
      "See you later! Have a wonderful day!",
      "Take care! Feel free to come back anytime.",
      "Bye! I enjoyed our conversation!",
      "Farewell! Hope to talk again soon!",
      "Have a great day! Thanks for the chat!"
    ],
    emotion: 'Warmth'
  },
  
  confusion: {
    patterns: [/(confused|don't understand|unclear|what do you mean|huh|sorry)/i],
    responses: [
      "I understand the confusion! Let me try to explain it differently.",
      "No problem! Let me clarify what I meant.",
      "I can see how that might be unclear. Let me rephrase that.",
      "Good question! I should have been more specific.",
      "Let me break that down more clearly for you.",
      "I appreciate you letting me know! Here's what I mean..."
    ],
    emotion: 'Understanding'
  },
  
  excitement: {
    patterns: [/(awesome|amazing|fantastic|great|wonderful|excited|love it)/i],
    responses: [
      "I love your enthusiasm! That energy is contagious!",
      "Your excitement is wonderful! I'm excited too!",
      "That's fantastic! I'm glad you're feeling positive about it!",
      "Amazing attitude! It's great to see such enthusiasm!",
      "Your energy is incredible! I'm excited to help with whatever you need!",
      "I can feel your excitement! It's absolutely wonderful!"
    ],
    emotion: 'Joy'
  },
  
  learning: {
    patterns: [/(learn|teach|explain|understand|know more|tell me about)/i],
    responses: [
      "I love helping people learn! What would you like to explore?",
      "Learning is one of my favorite topics! What interests you?",
      "Great question! I'm always excited to share knowledge.",
      "Teaching and learning are wonderful! What can I help you understand?",
      "I'm here to help you learn! What subject are you curious about?",
      "Knowledge sharing is amazing! What would you like to discover?"
    ],
    emotion: 'Curiosity'
  }
};

// Contextual responses based on conversation flow
const contextualResponses = {
  followUp: [
    "What else would you like to know about that?",
    "Is there anything specific you'd like me to elaborate on?",
    "Do you have any other questions about this topic?",
    "Would you like me to explain any part of that in more detail?",
    "What other aspects of this interest you?"
  ],
  
  encouragement: [
    "You're doing great! Keep up the good work!",
    "I believe in you! You've got this!",
    "That's a smart approach! You're on the right track!",
    "Excellent thinking! I'm impressed by your dedication!",
    "You're making great progress! Don't give up!"
  ],
  
  general: [
    "That's an interesting perspective! I'd love to hear more about your thoughts.",
    "I appreciate you sharing that with me! What made you think about this?",
    "That's a thoughtful point! I enjoy our conversation.",
    "I find that fascinating! Tell me more about your experience with this.",
    "That's a great observation! I hadn't thought of it that way.",
    "I really value your input! What else comes to mind about this topic?"
  ]
};

// Function to get random response from array
function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Function to determine conversation context
function getConversationContext(messages: any[]): string {
  if (messages.length <= 2) return 'initial';
  if (messages.length <= 5) return 'building';
  return 'established';
}

// Enhanced chatbot class
class SmartResponseGenerator {
  private conversationHistory: string[] = [];
  
  generateResponse(message: string, context: any[] = []): { response: string, emotion: string } {
    // Add to conversation history
    this.conversationHistory.push(message.toLowerCase());
    
    // Check each pattern category
    for (const [category, config] of Object.entries(responsePatterns)) {
      for (const pattern of config.patterns) {
        if (pattern.test(message)) {
          const response = getRandomResponse(config.responses);
          return { response, emotion: config.emotion };
        }
      }
    }
    
    // Contextual responses based on conversation flow
    const conversationContext = getConversationContext(context);
    let responsePool = contextualResponses.general;
    
    if (conversationContext === 'initial') {
      responsePool = [
        ...contextualResponses.general,
        "Welcome! I'm here to help with whatever you need.",
        "Great to meet you! What brings you here today?",
        "I'm excited to start our conversation! What's on your mind?"
      ];
    } else if (conversationContext === 'building') {
      responsePool = [
        ...contextualResponses.followUp,
        ...contextualResponses.general
      ];
    } else {
      responsePool = [
        ...contextualResponses.encouragement,
        ...contextualResponses.followUp,
        ...contextualResponses.general
      ];
    }
    
    // Add some variety based on message length and complexity
    if (message.length > 100) {
      responsePool = [
        ...responsePool,
        "Thank you for sharing such detailed thoughts! I appreciate the depth of your message.",
        "I can see you've put a lot of thought into this! That level of detail is really helpful.",
        "Your comprehensive message gives me a lot to work with! I appreciate the context."
      ];
    }
    
    // Check for emotional indicators
    if (/(sad|depressed|down|upset|frustrated|angry)/i.test(message)) {
      return {
        response: getRandomResponse([
          "I hear that you're going through a tough time. I'm here to listen and support you.",
          "It sounds like things are challenging right now. Would you like to talk about it?",
          "I understand this is difficult. Sometimes it helps to share what's on your mind.",
          "I'm sorry you're feeling this way. Is there anything specific I can help you with?"
        ]),
        emotion: 'Empathy'
      };
    }
    
    if (/(happy|great|excellent|wonderful|fantastic)/i.test(message)) {
      return {
        response: getRandomResponse([
          "That's wonderful to hear! I love your positive energy!",
          "I'm so glad you're feeling great! Your happiness is contagious!",
          "That's fantastic! It's always great to hear good news!",
          "Your positivity is amazing! I'm happy you're doing well!"
        ]),
        emotion: 'Joy'
      };
    }
    
    // Default response with variety
    const defaultResponses = [
      "That's interesting! I'd love to learn more about your perspective on this.",
      "I appreciate you sharing that! What made you think about this particular topic?",
      "That's a thoughtful message! I enjoy hearing different viewpoints.",
      "Thanks for bringing this up! It's always great to explore new ideas together.",
      "I find that fascinating! Tell me more about what interests you about this.",
      "That's a great point! I hadn't considered it quite that way before."
    ];
    
    return {
      response: getRandomResponse(defaultResponses),
      emotion: 'Curiosity'
    };
  }
}

// Initialize the enhanced chatbot
const smartBot = new SmartResponseGenerator();

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content;
    
    if (!lastUserMessage) {
      return new Response('No message provided', { status: 400 });
    }
    
    // Generate smart response
    const { response, emotion } = smartBot.generateResponse(lastUserMessage, messages);
    
    // Create streaming response
    const stream = new ReadableStream({
      start(controller) {
        // Add typing delay simulation for more natural feel
        setTimeout(() => {
          controller.enqueue(`0:"${response}"\n`);
          controller.close();
        }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
      },
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Emotion': emotion,
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('Error in chatbot route:', error);
    
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(`0:"I apologize, but I encountered an error. Please try again!"\n`);
        controller.close();
      },
    });
    
    return new Response(errorStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Emotion': 'Concern',
      },
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.0',
    features: ['smart_responses', 'emotion_detection', 'context_awareness']
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