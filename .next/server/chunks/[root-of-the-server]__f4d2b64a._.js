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
"[project]/src/lib/ai-provider.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/ai-providers.ts
__turbopack_context__.s({
    "EnhancedChatbot": (()=>EnhancedChatbot),
    "HuggingFaceService": (()=>HuggingFaceService),
    "OpenAIService": (()=>OpenAIService)
});
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
                throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }
            const data = await response.json();
            return {
                message: data.choices[0].message.content,
                provider: 'OpenAI'
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return {
                message: 'Sorry, I encountered an error with OpenAI. Please try again.',
                error: error instanceof Error ? error.message : 'Unknown error',
                provider: 'OpenAI'
            };
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
    async processMessage(userMessage) {
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
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
        const lowerMessage = message.toLowerCase();
        // Quick responses for common queries
        if (lowerMessage.match(/^(hi|hello|hey)$/)) {
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
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai-provider.ts [app-route] (ecmascript)");
;
;
// This is a simplified in-memory store.
// In production, you would use a database or a service like Redis to store conversations per user.
const conversations = new Map();
function getChatbot(sessionId) {
    if (!conversations.has(sessionId)) {
        console.log(`Creating new chatbot session for ID: ${sessionId}`);
        const systemPrompt = "You are Cayla, a compassionate and understanding AI friend. Your purpose is to help teenagers navigate complex emotional situations. You are patient, non-judgmental, and insightful. You do not give direct advice, but instead, you help users explore their own feelings and perspectives by asking thoughtful questions and offering gentle reflections. You respond in a warm, conversational, and slightly informal tone, like a wise older sister or a good friend. Your goal is to provide clarity and emotional support.";
        const chatbot = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EnhancedChatbot"]({
            openaiKey: process.env.OPENAI_API_KEY || '',
            systemPrompt: systemPrompt
        });
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
        if (response.error) {
            console.error('Chat API Error from AI Provider:', response.error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: response.message || 'Internal server error'
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: response.message,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__f4d2b64a._.js.map