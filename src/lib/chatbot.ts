// lib/chatbot.ts

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export class CasualChatbot {
  private isReady: boolean = true; // Start ready since we're using pattern matching

  constructor() {
    console.log('Casual chatbot initialized');
  }

  chat(userMessage: string): string {
    if (!userMessage || typeof userMessage !== 'string') {
      return "I didn't catch that, could you say something?";
    }

    const msg = userMessage.toLowerCase().trim();
    
    // Greeting patterns
    if (this.matchesPattern(msg, ['hi', 'hello', 'hey', 'sup', 'yo'])) {
      const greetings = ["hey there!", "what's up?", "hi! how's it going?", "yo!", "hey!"];
      return this.getRandomResponse(greetings);
    }

    // How are you patterns
    if (this.matchesPattern(msg, ['how are you', 'how\'re you', 'how r u'])) {
      const responses = ["i'm doing alright, you?", "pretty good tbh", "can't complain", "doing well, thanks!"];
      return this.getRandomResponse(responses);
    }

    // Thanks patterns
    if (this.matchesPattern(msg, ['thanks', 'thank you', 'thx'])) {
      const responses = ["no problem!", "you're welcome", "anytime", "np!", "glad to help"];
      return this.getRandomResponse(responses);
    }

    // Goodbye patterns
    if (this.matchesPattern(msg, ['bye', 'goodbye', 'see you', 'later', 'gtg'])) {
      const responses = ["see ya!", "later!", "catch you later", "bye!", "take care"];
      return this.getRandomResponse(responses);
    }

    // Question patterns
    if (msg.includes('what') || msg.includes('how') || msg.includes('why') || msg.includes('when') || msg.includes('where')) {
      const responses = [
        "that's a good question, not sure though",
        "hmm, i'd have to think about that",
        "interesting question",
        "wish i knew the answer to that",
        "you got me there"
      ];
      return this.getRandomResponse(responses);
    }

    // Compliment patterns
    if (this.matchesPattern(msg, ['cool', 'awesome', 'nice', 'great', 'amazing'])) {
      const responses = ["right?", "ikr!", "totally", "glad you think so", "thanks!"];
      return this.getRandomResponse(responses);
    }

    // Default casual responses
    const defaultResponses = [
      "that's interesting",
      "tell me more about that",
      "i see what you mean",
      "fair point",
      "makes sense",
      "yeah i get that",
      "interesting take"
    ];

    return this.getRandomResponse(defaultResponses);
  }

  private matchesPattern(message: string, patterns: string[]): boolean {
    return patterns.some(pattern => message.includes(pattern));
  }

  private getRandomResponse(responses: string[]): string {
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Add casual elements occasionally
    if (Math.random() < 0.15) {
      const casualElements = ['lol', 'haha', 'btw', 'tbh'];
      const element = casualElements[Math.floor(Math.random() * casualElements.length)];
      return `${response} ${element}`;
    }

    return response;
  }

  // Get a random conversation starter
  getConversationStarter(): string {
    const starters = [
      "hey, what's up?",
      "how's your day going?",
      "what's new?",
      "yo, how are you?",
      "what's happening?",
      "sup!",
      "how's it going?",
      "what's good?"
    ];
    
    return starters[Math.floor(Math.random() * starters.length)];
  }

  // Check if the chatbot is ready to chat
  isModelReady(): boolean {
    return this.isReady;
  }

  // Add some learning capability (simple pattern storage)
  learn(userInput: string, botResponse: string) {
    // For now, just log the interaction
    console.log('Learning from interaction:', { userInput, botResponse });
  }
}

// Create a singleton instance
let chatbotInstance: CasualChatbot | null = null;

export const getChatbot = (): CasualChatbot => {
  if (!chatbotInstance) {
    chatbotInstance = new CasualChatbot();
  }
  return chatbotInstance;
};

export const chatbot = getChatbot();


// src/lib/chatbot.ts

import { tokenize, Tokenizer } from './tokenizer';

export interface TrainingExample {
  input: string;
  output: string;
  context?: string;
}

export class ChatBot {
  private tokenizer: Tokenizer;
  private responses: Map<string, string[]> = new Map();
  private patterns: Array<{ pattern: RegExp; responses: string[] }> = [];
  private isInitialized: boolean = false;

  constructor() {
    this.tokenizer = new Tokenizer();
    this.initializeBasicPatterns();
  }

  private initializeBasicPatterns() {
    // Basic conversation patterns
    this.patterns = [
      {
        pattern: /hello|hi|hey|greetings/i,
        responses: [
          "hey there! what's up?",
          "hi! how can i help?",
          "hello! nice to meet you",
          "sup! what's on your mind?"
        ]
      },
      {
        pattern: /how are you|how's it going|what's up/i,
        responses: [
          "i'm doing well, thanks for asking!",
          "pretty good, just here to help",
          "all good on my end, how about you?",
          "can't complain, what about you?"
        ]
      },
      {
        pattern: /bye|goodbye|see you|later/i,
        responses: [
          "see you later!",
          "bye! have a good one",
          "catch you later",
          "goodbye! feel free to come back anytime"
        ]
      },
      {
        pattern: /thank you|thanks|appreciate/i,
        responses: [
          "you're welcome!",
          "no problem at all",
          "happy to help!",
          "anytime!"
        ]
      }
    ];
  }

  public async train(examples: TrainingExample[]): Promise<void> {
    console.log(`Training chatbot with ${examples.length} examples...`);
    
    for (const example of examples) {
      // Tokenize and store the input-output pairs
      const inputTokens = this.tokenizer.tokenize(example.input.toLowerCase());
      const inputKey = inputTokens.map(t => t.text).join(' ');
      
      if (!this.responses.has(inputKey)) {
        this.responses.set(inputKey, []);
      }
      
      this.responses.get(inputKey)!.push(example.output);
    }
    
    this.isInitialized = true;
    console.log('Chatbot training completed!');
  }

  public async generateResponse(input: string): Promise<string> {
    if (!input || typeof input !== 'string') {
      return "i didn't catch that, could you say it again?";
    }

    const normalizedInput = input.toLowerCase().trim();
    
    // First, try exact matches from training data
    if (this.isInitialized) {
      const inputTokens = this.tokenizer.tokenize(normalizedInput);
      const inputKey = inputTokens.map(t => t.text).join(' ');
      
      if (this.responses.has(inputKey)) {
        const possibleResponses = this.responses.get(inputKey)!;
        return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
      }
      
      // Try partial matches
      for (const [key, responses] of this.responses.entries()) {
        if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }
    
    // Fall back to pattern matching
    for (const { pattern, responses } of this.patterns) {
      if (pattern.test(normalizedInput)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Default responses if nothing matches
    const defaultResponses = [
      "that's interesting, tell me more",
      "i'm not sure about that one",
      "could you rephrase that?",
      "hmm, that's a good question",
      "i'm still learning about that topic",
      "what do you think about it?",
      "interesting perspective!"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  public addResponse(input: string, output: string): void {
    const inputTokens = this.tokenizer.tokenize(input.toLowerCase());
    const inputKey = inputTokens.map(t => t.text).join(' ');
    
    if (!this.responses.has(inputKey)) {
      this.responses.set(inputKey, []);
    }
    
    this.responses.get(inputKey)!.push(output);
  }

  public getStats(): { 
    totalResponses: number; 
    uniqueInputs: number; 
    vocabularySize: number;
    isInitialized: boolean;
  } {
    return {
      totalResponses: Array.from(this.responses.values()).reduce((sum, arr) => sum + arr.length, 0),
      uniqueInputs: this.responses.size,
      vocabularySize: this.tokenizer.getVocabSize(),
      isInitialized: this.isInitialized
    };
  }
}

// Export a default instance
const defaultChatBot = new ChatBot();
export default defaultChatBot;