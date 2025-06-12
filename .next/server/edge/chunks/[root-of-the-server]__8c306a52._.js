(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__8c306a52._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/lib/ai-provider.ts [app-edge-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/ai-providers.ts
// Custom Error Types
__turbopack_context__.s({
    "AIProviderError": (()=>AIProviderError),
    "AuthError": (()=>AuthError),
    "EnhancedChatbot": (()=>EnhancedChatbot),
    "HuggingFaceService": (()=>HuggingFaceService),
    "OpenAIService": (()=>OpenAIService),
    "RateLimitError": (()=>RateLimitError)
});
class AIProviderError extends Error {
    status;
    provider;
    constructor(message, status, provider){
        super(message), this.status = status, this.provider = provider;
        this.name = 'AIProviderError';
    }
}
class AuthError extends AIProviderError {
    constructor(provider){
        super('Authentication error. Please check your API key.', 401, provider);
        this.name = 'AuthError';
    }
}
class RateLimitError extends AIProviderError {
    constructor(provider){
        super("I'm receiving too many requests right now. Please try again in a moment.", 429, provider);
        this.name = 'RateLimitError';
    }
}
class OpenAIService {
    apiKey;
    baseUrl = 'https://api.openai.com/v1';
    constructor(apiKey){
        this.apiKey = apiKey;
    }
    async generateResponse(messages, model = 'gpt-3.5-turbo') {
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    max_tokens: 1000,
                    temperature: 0.7,
                    stream: false
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
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
                provider: 'OpenAI'
            };
        } catch (error) {
            console.error('Failed to generate response from OpenAI:', error);
            if (error instanceof AIProviderError) {
                throw error;
            }
            throw new AIProviderError('An unexpected error occurred while connecting to the AI service.', 503, 'OpenAI');
        }
    }
    // For streaming responses (optional)
    async generateStreamResponse(messages, onChunk, model = 'gpt-3.5-turbo') {
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    max_tokens: 1000,
                    temperature: 0.7,
                    stream: true
                })
            });
            if (!response.ok) {
                throw new Error(`OpenAI API Error: ${response.status}`);
            }
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No response body');
            let fullMessage = '';
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n').filter((line)=>line.trim());
                for (const line of lines){
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
                provider: 'OpenAI'
            };
        } catch (error) {
            console.error('OpenAI Streaming Error:', error);
            return {
                message: 'Sorry, I encountered an error with OpenAI streaming.',
                error: error instanceof Error ? error.message : 'Unknown error',
                provider: 'OpenAI'
            };
        }
    }
}
class HuggingFaceService {
    apiKey;
    baseUrl = 'https://api-inference.huggingface.co/models';
    constructor(apiKey){
        this.apiKey = apiKey;
    }
    async generateResponse(messages, model = 'microsoft/DialoGPT-large') {
        try {
            // Convert messages to a single input for most HF models
            const input = this.formatMessagesForHF(messages);
            const response = await fetch(`${this.baseUrl}/${model}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: input,
                    parameters: {
                        max_length: 1000,
                        temperature: 0.7,
                        do_sample: true,
                        top_p: 0.9
                    }
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
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
                provider: 'Hugging Face'
            };
        } catch (error) {
            console.error('Hugging Face API Error:', error);
            return {
                message: 'Sorry, I encountered an error with Hugging Face. Please try again.',
                error: error instanceof Error ? error.message : 'Unknown error',
                provider: 'Hugging Face'
            };
        }
    }
    // For chat-specific models like Llama, Mistral, etc.
    async generateChatResponse(messages, model = 'meta-llama/Llama-2-7b-chat-hf') {
        try {
            const response = await fetch(`${this.baseUrl}/${model}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: {
                        messages: messages
                    },
                    parameters: {
                        max_new_tokens: 500,
                        temperature: 0.7,
                        do_sample: true
                    }
                })
            });
            if (!response.ok) {
                throw new Error(`Hugging Face Chat API Error: ${response.status}`);
            }
            const data = await response.json();
            return {
                message: data.choices?.[0]?.message?.content || data.generated_text || 'No response generated.',
                provider: 'Hugging Face'
            };
        } catch (error) {
            console.error('Hugging Face Chat API Error:', error);
            return {
                message: 'Sorry, I encountered an error with Hugging Face chat model.',
                error: error instanceof Error ? error.message : 'Unknown error',
                provider: 'Hugging Face'
            };
        }
    }
    formatMessagesForHF(messages) {
        // Format conversation for traditional text generation models
        return messages.filter((msg)=>msg.role !== 'system').map((msg)=>`${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`).join('\n') + '\nAssistant:';
    }
}
class EnhancedChatbot {
    openaiService;
    huggingfaceService;
    conversationHistory = [];
    currentProvider;
    systemPrompt;
    constructor(config){
        if (config.openaiKey) {
            this.openaiService = new OpenAIService(config.openaiKey);
        }
        if (config.huggingfaceKey) {
            this.huggingfaceService = new HuggingFaceService(config.huggingfaceKey);
        }
        this.currentProvider = config.provider || 'openai';
        this.systemPrompt = config.systemPrompt || 'You are a helpful AI assistant. Provide accurate, helpful, and engaging responses.';
        // Initialize conversation with system message
        this.conversationHistory.push({
            role: 'system',
            content: this.systemPrompt
        });
    }
    async processMessage(userMessage, options = {}) {
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: options.short ? `Please answer the following concisely, in one or two sentences at most. ${userMessage}` : userMessage
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
        let response;
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
    switchProvider(provider) {
        if (provider === 'openai' && this.openaiService) {
            this.currentProvider = 'openai';
            return true;
        } else if (provider === 'huggingface' && this.huggingfaceService) {
            this.currentProvider = 'huggingface';
            return true;
        }
        return false;
    }
    getCurrentProvider() {
        return this.currentProvider;
    }
    checkPredefinedResponses(message) {
        const lowerMessage = message.toLowerCase().trim();
        // You can add as many custom responses as you like here.
        // The key is the user's exact phrase (in lowercase), and the value is the bot's response.
        const customResponses = {
            'hello': 'Hello there! Ask me anything.',
            'how are you?': "I'm an AI, so I'm always doing great! How can I help you today?",
            'what is your name?': "You can call me Cayla. It's nice to meet you!",
            'tell me a joke': "Why don't scientists trust atoms? Because they make up everything!",
            'what can you do?': "I can answer your questions, provide information, and hopefully make you smile. I'm still learning, though!"
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
    trimConversationHistory() {
        // Keep last 20 messages + system message
        if (this.conversationHistory.length > 21) {
            this.conversationHistory = [
                this.conversationHistory[0],
                ...this.conversationHistory.slice(-20)
            ];
        }
    }
    clearHistory() {
        this.conversationHistory = [
            {
                role: 'system',
                content: this.systemPrompt
            }
        ];
    }
    getConversationHistory() {
        return [
            ...this.conversationHistory
        ];
    }
}
}}),
"[project]/src/app/api/chat/route.ts [app-edge-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "OPTIONS": (()=>OPTIONS),
    "POST": (()=>POST),
    "runtime": (()=>runtime)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$provider$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai-provider.ts [app-edge-route] (ecmascript)");
;
const runtime = 'edge';
// Initialize the chatbot logic
const chatbot = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$provider$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["EnhancedChatbot"]({});
async function POST(req) {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content;
    // 1. Check for a predefined response first
    if (lastUserMessage) {
        const predefinedResponse = chatbot.checkPredefinedResponses(lastUserMessage);
        if (predefinedResponse) {
            // If found, return it immediately in the correct streaming format.
            // The '0:' prefix is part of the Vercel AI SDK protocol for text chunks.
            const stream = new ReadableStream({
                start (controller) {
                    controller.enqueue(`0:"${predefinedResponse}"\n`);
                    controller.close();
                }
            });
            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Emotion': 'Normal'
                }
            });
        }
    }
    // 2. If no predefined response, return a default message.
    const defaultResponse = "Sorry, I can only respond to a few specific phrases right now. I'll be able to chat more once my brain is fully connected!";
    const stream = new ReadableStream({
        start (controller) {
            controller.enqueue(`0:"${defaultResponse}"\n`);
            controller.close();
        }
    });
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Emotion': 'Sadness'
        }
    });
}
async function GET() {
    return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__8c306a52._.js.map