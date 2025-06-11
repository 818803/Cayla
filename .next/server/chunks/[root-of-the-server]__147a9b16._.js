module.exports = {

"[project]/.next-internal/server/app/api/chat/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/lib/llm-service.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/llm-service.ts
__turbopack_context__.s({
    "LLMService": (()=>LLMService)
});
class LLMService {
    config;
    provider;
    fallbackResponses = [
        "Dunno"
    ];
    constructor(config, provider = 'auto'){
        this.config = {
            maxTokens: 1500,
            temperature: 0.7,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
            ...config
        };
        this.provider = provider;
    }
    async generateResponse(messages) {
        // Validate input
        if (!messages || messages.length === 0) {
            return {
                message: "I didn't receive any message to respond to. What would you like to talk about?",
                error: "No messages provided"
            };
        }
        // Auto-detect provider or use specified one
        const selectedProvider = this.provider === 'auto' ? this.detectBestProvider() : this.provider;
        try {
            switch(selectedProvider){
                case 'anthropic':
                    return await this.generateResponseClaude(messages);
                case 'openai':
                default:
                    return await this.generateResponseOpenAI(messages);
            }
        } catch (error) {
            return this.handleError(error);
        }
    }
    async generateResponseOpenAI(messages) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model || 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature,
                top_p: this.config.topP,
                frequency_penalty: this.config.frequencyPenalty,
                presence_penalty: this.config.presencePenalty
            })
        });
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        if (!data.choices || data.choices.length === 0) {
            throw new Error('No response generated from OpenAI');
        }
        return {
            message: data.choices[0].message.content,
            provider: 'openai',
            tokenUsage: data.usage ? {
                prompt: data.usage.prompt_tokens,
                completion: data.usage.completion_tokens,
                total: data.usage.total_tokens
            } : undefined
        };
    }
    async generateResponseClaude(messages) {
        const systemMessage = messages.find((m)=>m.role === 'system');
        const conversationMessages = messages.filter((m)=>m.role !== 'system');
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.config.model || 'claude-3-sonnet-20240229',
                max_tokens: this.config.maxTokens,
                messages: conversationMessages,
                system: systemMessage?.content,
                temperature: this.config.temperature,
                top_p: this.config.topP
            })
        });
        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        if (!data.content || data.content.length === 0) {
            throw new Error('No response generated from Claude');
        }
        return {
            message: data.content[0].text,
            provider: 'anthropic',
            tokenUsage: data.usage ? {
                prompt: data.usage.input_tokens,
                completion: data.usage.output_tokens,
                total: data.usage.input_tokens + data.usage.output_tokens
            } : undefined
        };
    }
    detectBestProvider() {
        // Simple logic to determine best provider
        // You can enhance this based on your needs
        if (this.config.model?.includes('claude')) {
            return 'anthropic';
        }
        return 'openai';
    }
    handleError(error) {
        console.error('LLM Service Error:', error);
        let contextualMessage = this.getRandomFallbackResponse();
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
            // Provide contextual responses based on error type
            if (error.message.includes('401') || error.message.includes('unauthorized')) {
                contextualMessage = "It looks like there's an authentication issue. Please check your API key configuration.";
            } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                contextualMessage = "I'm getting too many requests right now. Please wait a moment and try again.";
            } else if (error.message.includes('400') || error.message.includes('bad request')) {
                contextualMessage = "There seems to be an issue with how your request was formatted. Could you try rephrasing?";
            } else if (error.message.includes('500') || error.message.includes('internal server')) {
                contextualMessage = "The AI service is experiencing technical difficulties. Please try again in a few minutes.";
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                contextualMessage = "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
            }
        }
        return {
            message: contextualMessage,
            error: errorMessage
        };
    }
    getRandomFallbackResponse() {
        return this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
    }
    // Utility methods
    async streamResponse(messages, onChunk) {
        // Implementation for streaming responses
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify({
                    model: this.config.model || 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: this.config.maxTokens,
                    temperature: this.config.temperature,
                    stream: true
                })
            });
            if (!response.ok) {
                throw new Error(`Streaming API error: ${response.status}`);
            }
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response stream available');
            }
            let fullMessage = '';
            const decoder = new TextDecoder();
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter((line)=>line.trim());
                for (const line of lines){
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                fullMessage += content;
                                onChunk(content);
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                }
            }
            return {
                message: fullMessage,
                provider: 'openai'
            };
        } catch (error) {
            return this.handleError(error);
        }
    }
    // Method to check API health
    async healthCheck() {
        try {
            const testMessage = [
                {
                    role: 'user',
                    content: 'Hello'
                }
            ];
            const response = await this.generateResponse(testMessage);
            return {
                status: response.error ? 'unhealthy' : 'healthy',
                provider: response.provider || 'unknown'
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                provider: 'unknown'
            };
        }
    }
    // Method to estimate token count (rough approximation)
    estimateTokens(text) {
        // Rough estimation: ~4 characters per token for English text
        return Math.ceil(text.length / 4);
    }
    // Method to truncate messages if they exceed token limits
    truncateMessages(messages, maxTokens) {
        let totalTokens = 0;
        const truncatedMessages = [];
        // Always keep system message if present
        const systemMessage = messages.find((m)=>m.role === 'system');
        if (systemMessage) {
            totalTokens += this.estimateTokens(systemMessage.content);
            truncatedMessages.push(systemMessage);
        }
        // Add messages from most recent backwards
        const conversationMessages = messages.filter((m)=>m.role !== 'system').reverse();
        for (const message of conversationMessages){
            const messageTokens = this.estimateTokens(message.content);
            if (totalTokens + messageTokens <= maxTokens) {
                totalTokens += messageTokens;
                truncatedMessages.unshift(message);
            } else {
                break;
            }
        }
        return truncatedMessages;
    }
}
}}),
"[project]/src/lib/enhanced-chatbot.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "EnhancedChatbot": (()=>EnhancedChatbot)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$llm$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/llm-service.ts [app-route] (ecmascript)");
;
class EnhancedChatbot {
    llmService;
    conversationHistory = [];
    systemPrompt;
    constructor(apiKey, model = 'gpt-3.5-turbo'){
        this.llmService = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$llm$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMService"](apiKey, model);
        this.systemPrompt = `You are a helpful AI assistant. You provide accurate, helpful, and engaging responses to user questions. You can discuss a wide range of topics and help with various tasks.`;
        // Initialize with system message
        this.conversationHistory.push({
            role: 'system',
            content: this.systemPrompt
        });
    }
    async processMessage(userMessage) {
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });
        // Check for predefined responses first (your existing logic)
        const predefinedResponse = this.checkPredefinedResponses(userMessage);
        if (predefinedResponse) {
            this.conversationHistory.push({
                role: 'assistant',
                content: predefinedResponse
            });
            return predefinedResponse;
        }
        // Use LLM for complex queries
        const response = await this.llmService.generateResponse(this.conversationHistory);
        if (!response.error) {
            this.conversationHistory.push({
                role: 'assistant',
                content: response.message
            });
        }
        // Keep conversation history manageable (last 10 exchanges)
        if (this.conversationHistory.length > 21) {
            this.conversationHistory = [
                this.conversationHistory[0],
                ...this.conversationHistory.slice(-20)
            ];
        }
        return response.message;
    }
    checkPredefinedResponses(message) {
        const lowerMessage = message.toLowerCase();
        // Your existing predefined responses
        if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            return 'Hello! How can I help you today?';
        }
        if (lowerMessage.includes('time')) {
            return `The current time is ${new Date().toLocaleTimeString()}`;
        }
        if (lowerMessage.includes('weather')) {
            return 'I can help you with weather information. What location would you like to know about?';
        }
        // Add more predefined responses as needed
        return null; // No predefined response found
    }
    clearHistory() {
        this.conversationHistory = [
            {
                role: 'system',
                content: this.systemPrompt
            }
        ];
    }
    setSystemPrompt(prompt) {
        this.systemPrompt = prompt;
        this.conversationHistory[0] = {
            role: 'system',
            content: prompt
        };
    }
}
}}),
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enhanced$2d$chatbot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/enhanced-chatbot.ts [app-route] (ecmascript)");
;
;
// This is a simplified in-memory store.
// In production, you would use a database or a service like Redis to store conversations per user.
const conversations = new Map();
function getChatbot(sessionId) {
    if (!conversations.has(sessionId)) {
        console.log(`Creating new chatbot session for ID: ${sessionId}`);
        const chatbot = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enhanced$2d$chatbot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EnhancedChatbot"](process.env.OPENAI_API_KEY || '');
        // Customize the system prompt for Cayla
        chatbot.setSystemPrompt("You are Cayla, a compassionate and understanding AI friend. Your purpose is to help teenagers navigate complex emotional situations. You are patient, non-judgmental, and insightful. You do not give direct advice, but instead, you help users explore their own feelings and perspectives by asking thoughtful questions and offering gentle reflections. You respond in a warm, conversational, and slightly informal tone, like a wise older sister or a good friend. Your goal is to provide clarity and emotional support.");
        conversations.set(sessionId, chatbot);
    }
    return conversations.get(sessionId);
}
async function POST(request) {
    try {
        const body = await request.json();
        const { message, sessionId } = body;
        if (!message) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Message is required'
            }, {
                status: 400
            });
        }
        if (!sessionId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Session ID is required'
            }, {
                status: 400
            });
        }
        const chatbot = getChatbot(sessionId);
        const response = await chatbot.processMessage(message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: response,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__147a9b16._.js.map