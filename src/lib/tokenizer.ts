// Types and interfaces
export interface Token {
  id: number;
  text: string;
  type: 'word' | 'punctuation' | 'special' | 'number';
}

export interface Message {
  id: string;
  text: string;
  tokens: Token[];
  timestamp: Date;
  sender: 'user' | 'bot';
}

export interface TokenizerConfig {
  maxVocabSize: number;
  specialTokens: string[];
  caseSensitive: boolean;
}

// Fixed Tokenizer class
export class Tokenizer {
  private vocabulary: Map<string, number> = new Map();
  private reverseVocab: Map<number, string> = new Map();
  private tokenId: number = 0;
  private config: TokenizerConfig;

  constructor(config: Partial<TokenizerConfig> = {}) {
    this.config = {
      maxVocabSize: 10000,
      specialTokens: ['<pad>', '<unk>', '<bos>', '<eos>', '<user>', '<bot>', '<start>', '<end>'],
      caseSensitive: false,
      ...config
    };
    
    // Initialize with special tokens
    this.initializeSpecialTokens();
  }

  private initializeSpecialTokens(): void {
    this.config.specialTokens.forEach(token => {
      this.addToken(token, 'special');
    });
  }

  public addToken(text: string, type: Token['type'] = 'word'): number {
    const normalizedText = this.config.caseSensitive ? text : text.toLowerCase();
    
    if (this.vocabulary.has(normalizedText)) {
      return this.vocabulary.get(normalizedText)!;
    }

    // Check if we've reached max vocab size (except for special tokens)
    if (this.vocabulary.size >= this.config.maxVocabSize && type !== 'special') {
      const unkId = this.vocabulary.get('<unk>');
      if (unkId !== undefined) {
        return unkId;
      }
    }

    const id = this.tokenId++;
    this.vocabulary.set(normalizedText, id);
    this.reverseVocab.set(id, normalizedText);
    return id;
  }

  public tokenize(text: string): Token[] {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const tokens: Token[] = [];
    
    // Improved tokenization - handle punctuation better
    const words = text
      .replace(/([.!?;,:])/g, ' $1 ') // Add spaces around punctuation
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    words.forEach(word => {
      const normalizedWord = this.config.caseSensitive ? word : word.toLowerCase();
      const type = this.getTokenType(word);
      let tokenId = this.vocabulary.get(normalizedWord);
      
      if (tokenId === undefined) {
        tokenId = this.addToken(normalizedWord, type);
      }
      
      tokens.push({
        id: tokenId,
        text: word,
        type: type
      });
    });
    
    return tokens;
  }

  private getTokenType(text: string): Token['type'] {
    const normalizedText = this.config.caseSensitive ? text : text.toLowerCase();
    
    if (this.config.specialTokens.includes(normalizedText)) return 'special';
    if (/^\d+\.?\d*$/.test(text)) return 'number'; // Handles integers and decimals
    if (/^[^\w\s]+$/.test(text)) return 'punctuation'; // Handles all punctuation
    return 'word';
  }

  public encode(text: string): number[] {
    const tokens = this.tokenize(text);
    return tokens.map(token => token.id);
  }

  public decode(ids: number[]): string {
    return ids
      .map(id => this.reverseVocab.get(id) || '<unk>')
      .join(' ')
      .replace(/\s+([.!?;,:)])/g, '$1') // Remove spaces before punctuation
      .replace(/\(\s+/g, '('); // Remove spaces after opening parentheses
  }

  public detokenize(tokens: Token[]): string {
    return tokens
      .map(token => token.text)
      .join(' ')
      .replace(/\s+([.!?;,:)])/g, '$1') // Clean up punctuation spacing
      .replace(/\(\s+/g, '(');
  }

  public getVocabSize(): number {
    return this.vocabulary.size;
  }

  public getVocabulary(): Map<string, number> {
    return new Map(this.vocabulary);
  }

  public getTokenById(id: number): string | undefined {
    return this.reverseVocab.get(id);
  }

  public hasToken(text: string): boolean {
    const normalizedText = this.config.caseSensitive ? text : text.toLowerCase();
    return this.vocabulary.has(normalizedText);
  }

  public getTokenId(text: string): number | undefined {
    const normalizedText = this.config.caseSensitive ? text : text.toLowerCase();
    return this.vocabulary.get(normalizedText);
  }
}

// Simple AI Response Generator
export class AIResponseGenerator {
  private responses: Map<string, string[]> = new Map([
    ['greeting', ['Hello! How can I help you today?', 'Hi there! What can I do for you?', 'Greetings! How may I assist you?']],
    ['question', ['That\'s an interesting question!', 'Let me think about that...', 'I\'d be happy to help with that.']],
    ['default', ['I understand.', 'That\'s interesting.', 'Tell me more about that.', 'I see what you mean.']],
    ['goodbye', ['Goodbye! Have a great day!', 'See you later!', 'Until next time!']]
  ]);

  generateResponse(userMessage: string, tokens: Token[]): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple rule-based responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return this.getRandomResponse('greeting');
    }
    
    if (lowerMessage.includes('?')) {
      return this.getRandomResponse('question');
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return this.getRandomResponse('goodbye');
    }
    
    // Echo back with token info
    const tokenCount = tokens.length;
    const uniqueTokens = new Set(tokens.map(t => t.text.toLowerCase())).size;
    const tokenTypes = tokens.reduce((acc, token) => {
      acc[token.type] = (acc[token.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return `${this.getRandomResponse('default')} Your message had ${tokenCount} tokens (${uniqueTokens} unique). Token breakdown: ${Object.entries(tokenTypes).map(([type, count]) => `${count} ${type}`).join(', ')}.`;
  }

  private getRandomResponse(category: string): string {
    const responses = this.responses.get(category) || this.responses.get('default')!;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Main Chatbot class
export class AIChatbot {
  private tokenizer: Tokenizer;
  private responseGenerator: AIResponseGenerator;
  private messages: Message[] = [];
  private messageIdCounter: number = 0;

  constructor(tokenizerConfig?: Partial<TokenizerConfig>) {
    this.tokenizer = new Tokenizer(tokenizerConfig);
    this.responseGenerator = new AIResponseGenerator();
    
    // Pre-populate with common words
    this.initializeCommonVocabulary();
  }

  private initializeCommonVocabulary(): void {
    const commonWords = [
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'shall',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
      'what', 'when', 'where', 'why', 'how', 'who', 'which', 'hello', 'hi', 'bye', 'goodbye',
      'please', 'thank', 'thanks', 'yes', 'no', 'ok', 'okay'
    ];
    
    commonWords.forEach(word => this.tokenizer.addToken(word, 'word'));
  }

  public async processMessage(userInput: string): Promise<Message> {
    // Tokenize user input
    const userTokens = this.tokenizer.tokenize(userInput);
    
    // Create user message
    const userMessage: Message = {
      id: `msg_${this.messageIdCounter++}`,
      text: userInput,
      tokens: userTokens,
      timestamp: new Date(),
      sender: 'user'
    };
    
    this.messages.push(userMessage);
    
    // Generate bot response
    const botResponseText = this.responseGenerator.generateResponse(userInput, userTokens);
    const botTokens = this.tokenizer.tokenize(botResponseText);
    
    const botMessage: Message = {
      id: `msg_${this.messageIdCounter++}`,
      text: botResponseText,
      tokens: botTokens,
      timestamp: new Date(),
      sender: 'bot'
    };
    
    this.messages.push(botMessage);
    
    return botMessage;
  }

  public getMessages(): Message[] {
    return [...this.messages];
  }

  public getTokenizer(): Tokenizer {
    return this.tokenizer;
  }

  public getVocabularyStats(): {
    size: number;
    maxSize: number;
    specialTokens: number;
    wordTokens: number;
    punctuationTokens: number;
    numberTokens: number;
  } {
    const allTokens = this.messages.flatMap(msg => msg.tokens);
    const tokenTypes = allTokens.reduce((acc, token) => {
      acc[token.type] = (acc[token.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      size: this.tokenizer.getVocabSize(),
      maxSize: this.tokenizer['config'].maxVocabSize,
      specialTokens: tokenTypes.special || 0,
      wordTokens: tokenTypes.word || 0,
      punctuationTokens: tokenTypes.punctuation || 0,
      numberTokens: tokenTypes.number || 0
    };
  }

  public exportConversation(): string {
    return JSON.stringify(this.messages, null, 2);
  }

  public clearConversation(): void {
    this.messages = [];
    this.messageIdCounter = 0;
  }
}

// Usage example and testing function
export async function runChatbot(): Promise<AIChatbot> {
  const chatbot = new AIChatbot({
    maxVocabSize: 5000,
    caseSensitive: false
  });

  console.log('AI Chatbot initialized!');
  console.log('Vocabulary size:', chatbot.getVocabularyStats().size);
  
  // Simulate conversation
  const testMessages = [
    "Hello there!",
    "How are you doing today?",
    "Can you help me with programming?",
    "What's 2 + 2?",
    "Thanks for your help. Goodbye!"
  ];

  for (const message of testMessages) {
    console.log(`\nUser: ${message}`);
    const response = await chatbot.processMessage(message);
    console.log(`Bot: ${response.text}`);
    console.log(`Tokens: [${response.tokens.map(t => `${t.text}(${t.type})`).join(', ')}]`);
  }

  console.log('\n--- Conversation Stats ---');
  const stats = chatbot.getVocabularyStats();
  console.log(`Total vocabulary: ${stats.size}/${stats.maxSize}`);
  console.log(`Word tokens: ${stats.wordTokens}`);
  console.log(`Special tokens: ${stats.specialTokens}`);
  console.log(`Punctuation tokens: ${stats.punctuationTokens}`);
  console.log(`Number tokens: ${stats.numberTokens}`);

  return chatbot;
}

// Create a default tokenizer instance for standalone use
export const defaultTokenizer = new Tokenizer();

// Export convenience function for quick tokenization
export function tokenize(text: string): Token[] {
  return defaultTokenizer.tokenize(text);
}

// For Node.js execution
if (typeof require !== 'undefined' && require.main === module) {
  runChatbot().catch(console.error);
}