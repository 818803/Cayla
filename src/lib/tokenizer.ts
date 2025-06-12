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

// Create a default tokenizer instance for standalone use
export const defaultTokenizer = new Tokenizer();

// Export convenience function for quick tokenization
export function tokenize(text: string): Token[] {
  return defaultTokenizer.tokenize(text);
}