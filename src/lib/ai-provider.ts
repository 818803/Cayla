// lib/ai-providers.ts

// Custom Error Types
export class AIProviderError extends Error {
  constructor(message: string, public status: number, public provider: string) {
    super(message);
    this.name = 'AIProviderError';
  }
}

export class AuthError extends AIProviderError {
  constructor(provider: string) {
    super('Authentication error. Please check your API key.', 401, provider);
    this.name = 'AuthError';
  }
}

export class RateLimitError extends AIProviderError {
  constructor(provider: string) {
    super("I'm receiving too many requests right now. Please try again in a moment.", 429, provider);
    this.name = 'RateLimitError';
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  message: string;
  error?: string;
  provider?: string;
}

// OpenAI Integration
export class OpenAIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    messages: ChatMessage[],
    model: string = 'gpt-3.5-turbo'
  ): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `Unknown error with status ${response.status}`;
        console.error(`OpenAI API Error: ${response.status}`, errorData);

        if (response.status === 401) {
          throw new AuthError('OpenAI');
        }
        if (response.status === 429) {
          throw new RateLimitError('OpenAI');
        }

        throw new AIProviderError(errorMessage, response.status, 'OpenAI');
      }

      const data = await response.json();
      return {
        message: data.choices[0].message.content,
        provider: 'OpenAI',
      };
    } catch (error) {
      console.error('Failed to generate response from OpenAI:', error);
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        'An unexpected error occurred while connecting to the AI service.',
        503,
        'OpenAI'
      );
    }
  }

  // For streaming responses (optional)
  async generateStreamResponse(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    model: string = 'gpt-3.5-turbo'
  ): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let fullMessage = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                fullMessage += content;
                onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      return {
        message: fullMessage,
        provider: 'OpenAI',
      };
    } catch (error) {
      console.error('OpenAI Streaming Error:', error);
      return {
        message: 'Sorry, I encountered an error with OpenAI streaming.',
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'OpenAI',
      };
    }
  }
}

// Hugging Face Integration
export class HuggingFaceService {
  private apiKey: string;
  private baseUrl: string = 'https://api-inference.huggingface.co/models';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    messages: ChatMessage[],
    model: string = 'microsoft/DialoGPT-large'
  ): Promise<AIResponse> {
    try {
      // Convert messages to a single input for most HF models
      const input = this.formatMessagesForHF(messages);

      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: input,
          parameters: {
            max_length: 1000,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Hugging Face API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let message = '';
      if (Array.isArray(data) && data[0]?.generated_text) {
        message = data[0].generated_text.replace(input, '').trim();
      } else if (data.generated_text) {
        message = data.generated_text.replace(input, '').trim();
      } else {
        message = 'I received an unexpected response format.';
      }

      return {
        message: message || 'I apologize, but I couldn\'t generate a proper response.',
        provider: 'Hugging Face',
      };
    } catch (error) {
      console.error('Hugging Face API Error:', error);
      return {
        message: 'Sorry, I encountered an error with Hugging Face. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'Hugging Face',
      };
    }
  }

  // For chat-specific models like Llama, Mistral, etc.
  async generateChatResponse(
    messages: ChatMessage[],
    model: string = 'meta-llama/Llama-2-7b-chat-hf'
  ): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            messages: messages,
          },
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face Chat API Error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        message: data.choices?.[0]?.message?.content || data.generated_text || 'No response generated.',
        provider: 'Hugging Face',
      };
    } catch (error) {
      console.error('Hugging Face Chat API Error:', error);
      return {
        message: 'Sorry, I encountered an error with Hugging Face chat model.',
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'Hugging Face',
      };
    }
  }

  private formatMessagesForHF(messages: ChatMessage[]): string {
    // Format conversation for traditional text generation models
    return messages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n') + '\nAssistant:';
  }
}

// Enhanced Chatbot with multiple providers
export class EnhancedChatbot {
  private openaiService?: OpenAIService;
  private huggingfaceService?: HuggingFaceService;
  private conversationHistory: ChatMessage[] = [];
  private currentProvider: 'openai' | 'huggingface';
  private systemPrompt: string;

  constructor(
    config: {
      openaiKey?: string;
      huggingfaceKey?: string;
      provider?: 'openai' | 'huggingface';
      systemPrompt?: string;
    }
  ) {
    if (config.openaiKey) {
      this.openaiService = new OpenAIService(config.openaiKey);
    }
    
    if (config.huggingfaceKey) {
      this.huggingfaceService = new HuggingFaceService(config.huggingfaceKey);
    }

    this.currentProvider = config.provider || 'openai';
    this.systemPrompt = config.systemPrompt || 
      'You are a helpful AI assistant. Provide accurate, helpful, and engaging responses.';

    // Initialize conversation with system message
    this.conversationHistory.push({
      role: 'system',
      content: this.systemPrompt
    });
  }

  async processMessage(
    userMessage: string, 
    options: { short?: boolean } = {}
  ): Promise<AIResponse> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: options.short 
        ? `Please answer the following concisely, in one or two sentences at most. ${userMessage}`
        : userMessage
    });

    // Check for predefined responses first
    const predefinedResponse = this.checkPredefinedResponses(userMessage);
    if (predefinedResponse) {
      this.conversationHistory.push({
        role: 'assistant',
        content: predefinedResponse
      });
      return {
        message: predefinedResponse,
        provider: 'Predefined'
      };
    }

    // Use AI service
    let response: AIResponse;
    
    if (this.currentProvider === 'openai' && this.openaiService) {
        response = await this.openaiService.generateResponse(this.conversationHistory);
    } else if (this.currentProvider === 'huggingface' && this.huggingfaceService) {
        response = await this.huggingfaceService.generateResponse(this.conversationHistory);
    } else {
        response = {
        message: 'No AI provider configured. Please check your API keys.',
        error: 'No provider available'
        };
    }

    // Add assistant response to history if successful
    if (!response.error) {
      this.conversationHistory.push({
        role: 'assistant',
        content: response.message
      });
    }

    // Keep conversation history manageable
    this.trimConversationHistory();

    return response;
  }

  switchProvider(provider: 'openai' | 'huggingface'): boolean {
    if (provider === 'openai' && this.openaiService) {
      this.currentProvider = 'openai';
      return true;
    } else if (provider === 'huggingface' && this.huggingfaceService) {
      this.currentProvider = 'huggingface';
      return true;
    }
    return false;
  }

  getCurrentProvider(): string {
    return this.currentProvider;
  }

  public checkPredefinedResponses(message: string): string | null {
    const lowerMessage = message.toLowerCase().trim();

    // You can add as many custom responses as you like here.
    // The key is the user's exact phrase (in lowercase), and the value is the bot's response.
    const customResponses: Record<string, string> = {
      'hello': 'Hello there! Ask me anything.',
      'how are you?': "I'm an AI, so I'm always doing great! How can I help you today?",
      'what is your name?': "You can call me Cayla. It's nice to meet you!",
      'tell me a joke': "Why don't scientists trust atoms? Because they make up everything!",
      'what can you do?': "I can answer your questions, provide information, and hopefully make you smile. I'm still learning, though!",
    };

    if (customResponses[lowerMessage]) {
      return customResponses[lowerMessage];
    }
    
    // Fallback to original regex for general greetings
    if (lowerMessage.match(/^(hi|hey)$/)) {
      return 'Hello! How can I help you today?';
    }
    
    if (lowerMessage.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}`;
    }
    
    if (lowerMessage.includes('date')) {
      return `Today's date is ${new Date().toLocaleDateString()}`;
    }

    if (lowerMessage.includes('switch to openai')) {
      const switched = this.switchProvider('openai');
      return switched ? 'Switched to OpenAI provider.' : 'OpenAI provider not available.';
    }

    if (lowerMessage.includes('switch to huggingface')) {
      const switched = this.switchProvider('huggingface');
      return switched ? 'Switched to Hugging Face provider.' : 'Hugging Face provider not available.';
    }

    return null;
  }

  private trimConversationHistory(): void {
    // Keep last 20 messages + system message
    if (this.conversationHistory.length > 21) {
      this.conversationHistory = [
        this.conversationHistory[0], // Keep system message
        ...this.conversationHistory.slice(-20)
      ];
    }
  }

  clearHistory(): void {
    this.conversationHistory = [{
      role: 'system',
      content: this.systemPrompt
    }];
  }

  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }
}