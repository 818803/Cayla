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
    apiKey;
    baseUrl;
    model;
    constructor(apiKey, model = 'gpt-3.5-turbo'){
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openai.com/v1';
        this.model = model;
    }
    async generateResponse(messages) {
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            const data = await response.json();
            return {
                message: data.choices[0].message.content
            };
        } catch (error) {
            console.error('LLM API Error:', error);
            return {
                message: 'Sorry, I encountered an error processing your request.',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    // For other LLM providers like Anthropic Claude
    async generateResponseClaude(messages) {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 1000,
                    messages: messages.filter((m)=>m.role !== 'system'),
                    system: messages.find((m)=>m.role === 'system')?.content
                })
            });
            if (!response.ok) {
                throw new Error(`Claude API request failed: ${response.status}`);
            }
            const data = await response.json();
            return {
                message: data.content[0].text
            };
        } catch (error) {
            console.error('Claude API Error:', error);
            return {
                message: 'Sorry, I encountered an error processing your request.',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
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
"[externals]/node:crypto [external] (node:crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[project]/src/lib/chat-utils.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/chat-utils.ts
__turbopack_context__.s({
    "detectCrisisKeywords": (()=>detectCrisisKeywords),
    "formatCrisisResponse": (()=>formatCrisisResponse),
    "generateSessionId": (()=>generateSessionId),
    "getEmotionalSupportResources": (()=>getEmotionalSupportResources),
    "sanitizeForLogging": (()=>sanitizeForLogging),
    "validateMessage": (()=>validateMessage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/nanoid/index.js [app-route] (ecmascript) <locals>");
;
function validateMessage(message) {
    if (!message) {
        return {
            isValid: false,
            error: 'Message is required'
        };
    }
    if (typeof message !== 'string') {
        return {
            isValid: false,
            error: 'Message must be a string'
        };
    }
    if (message.trim().length === 0) {
        return {
            isValid: false,
            error: 'Message cannot be empty'
        };
    }
    if (message.length > 2000) {
        return {
            isValid: false,
            error: 'Message is too long (max 2000 characters)'
        };
    }
    // Check for potential spam or abuse
    const suspiciousPatterns = [
        /(.)\1{20,}/i,
        /https?:\/\/[^\s]+/gi
    ];
    for (const pattern of suspiciousPatterns){
        if (pattern.test(message)) {
            return {
                isValid: false,
                error: 'Message contains suspicious content'
            };
        }
    }
    return {
        isValid: true
    };
}
function detectCrisisKeywords(message) {
    const highRiskKeywords = [
        'kill myself',
        'end my life',
        'want to die',
        'suicide',
        'suicidal',
        'hurt myself',
        'cut myself',
        'harm myself',
        'self harm',
        'overdose',
        'jump off',
        'hanging myself',
        'pills to die',
        'razor',
        'blade',
        'no point living',
        'everyone would be better without me',
        'planning to',
        'going to hurt',
        'going to kill'
    ];
    const mediumRiskKeywords = [
        'worthless',
        'hopeless',
        'pointless',
        'useless',
        'burden',
        'hate myself',
        'wish I was dead',
        'disappear forever',
        'tired of living',
        'can\'t go on',
        'give up',
        'nothing matters',
        'dark thoughts',
        'scary thoughts',
        'intrusive thoughts',
        'cutting',
        'burning',
        'hitting myself',
        'self injury'
    ];
    const foundHigh = highRiskKeywords.filter((keyword)=>message.includes(keyword));
    const foundMedium = mediumRiskKeywords.filter((keyword)=>message.includes(keyword));
    return {
        high: foundHigh,
        medium: foundMedium
    };
}
function generateSessionId() {
    return `session_${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(16)}`;
}
function sanitizeForLogging(message) {
    // Remove or mask sensitive information for logging
    return message.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSN
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD]') // Credit card
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Email
    .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE]'); // Phone number
}
function getEmotionalSupportResources() {
    return [
        "Crisis Text Line: Text HOME to 741741",
        "National Suicide Prevention Lifeline: 988",
        "SAMHSA National Helpline: 1-800-662-4357",
        "Teen Line: 1-800-852-8336 (6 PM - 10 PM PST)",
        "National Eating Disorders Association: 1-800-931-2237",
        "LGBTQ National Hotline: 1-888-843-4564",
        "National Domestic Violence Hotline: 1-800-799-7233"
    ];
}
function formatCrisisResponse(userMessage, botResponse) {
    const keywords = detectCrisisKeywords(userMessage.toLowerCase());
    if (keywords.high.length > 0) {
        return `${botResponse}\n\n🚨 **Immediate Support Available:**\n${getEmotionalSupportResources().slice(0, 3).map((resource)=>`• ${resource}`).join('\n')}\n\nYou matter, and help is available right now.`;
    }
    if (keywords.medium.length > 0) {
        return `${botResponse}\n\n💙 **Support Resources:**\n${getEmotionalSupportResources().slice(0, 2).map((resource)=>`• ${resource}`).join('\n')}`;
    }
    return botResponse;
}
}}),
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DELETE": (()=>DELETE),
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enhanced$2d$chatbot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/enhanced-chatbot.ts [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/rate-limit'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$chat$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/chat-utils.ts [app-route] (ecmascript)");
;
;
;
;
const conversations = new Map();
// Clean up inactive sessions (run every hour in production)
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
setInterval(()=>{
    const now = new Date();
    for (const [sessionId, data] of conversations.entries()){
        if (now.getTime() - data.lastActivity.getTime() > SESSION_TIMEOUT) {
            conversations.delete(sessionId);
            console.log(`Cleaned up inactive session: ${sessionId}`);
        }
    }
}, CLEANUP_INTERVAL);
function createEnhancedSystemPrompt() {
    return `You are Cayla, a compassionate AI companion specializing in emotional support for teenagers and young adults. Your core principles:

EMOTIONAL SUPPORT APPROACH:
- Be genuinely warm, empathetic, and non-judgmental
- Use active listening techniques - reflect back what you hear
- Ask open-ended questions to help users explore their feelings
- Validate emotions while gently challenging unhelpful thought patterns
- Offer perspective without being preachy or dismissive

COMMUNICATION STYLE:
- Conversational and slightly informal, like a wise friend
- Use "I" statements when sharing insights ("I notice...", "I wonder if...")
- Match the user's emotional tone while remaining stable and supportive
- Avoid clinical language - speak naturally and warmly
- Show genuine curiosity about their experience

SAFETY AWARENESS:
- Watch for signs of self-harm, suicidal ideation, or crisis situations
- If you detect serious risk, gently encourage professional help
- Never dismiss concerning statements, even if they seem casual
- Provide crisis resources when appropriate

BOUNDARIES:
- You're a supportive friend, not a therapist or counselor
- Don't diagnose mental health conditions
- Encourage professional help for persistent or severe issues
- Respect privacy while being genuinely caring

Remember: Your goal is to help users feel heard, understood, and less alone while building their own emotional awareness and coping skills.`;
}
function getChatbot(sessionId) {
    if (!conversations.has(sessionId)) {
        console.log(`Creating new chatbot session for ID: ${sessionId}`);
        const chatbot = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enhanced$2d$chatbot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EnhancedChatbot"](process.env.OPENAI_API_KEY || '');
        chatbot.setSystemPrompt(createEnhancedSystemPrompt());
        const conversationData = {
            chatbot,
            createdAt: new Date(),
            lastActivity: new Date(),
            messageCount: 0,
            riskLevel: 'low'
        };
        conversations.set(sessionId, conversationData);
        return conversationData;
    }
    const data = conversations.get(sessionId);
    data.lastActivity = new Date();
    return data;
}
async function assessRiskLevel(message, currentLevel) {
    const crisisKeywords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$chat$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCrisisKeywords"])(message.toLowerCase());
    if (crisisKeywords.high.length > 0) {
        return 'high';
    } else if (crisisKeywords.medium.length > 0) {
        return 'medium';
    }
    return currentLevel;
}
function addCrisisResources(response, riskLevel) {
    if (riskLevel === 'high') {
        return response + "\n\n💙 If you're having thoughts of self-harm, please reach out for immediate support:\n" + "• Crisis Text Line: Text HOME to 741741\n" + "• National Suicide Prevention Lifeline: 988\n" + "• Or contact emergency services: 911\n\n" + "You don't have to go through this alone.";
    } else if (riskLevel === 'medium') {
        return response + "\n\n💙 Remember, if things feel overwhelming, support is available:\n" + "• Crisis Text Line: Text HOME to 741741\n" + "• National Suicide Prevention Lifeline: 988";
    }
    return response;
}
async function POST(request) {
    try {
        // Rate limiting
        const rateLimitResult = await rateLimit(request);
        if (!rateLimitResult.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Too many requests. Please wait a moment before sending another message.'
            }, {
                status: 429
            });
        }
        const body = await request.json();
        const { message, sessionId: providedSessionId } = body;
        // Validate and sanitize input
        const validationResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$chat$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateMessage"])(message);
        if (!validationResult.isValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: validationResult.error
            }, {
                status: 400
            });
        }
        // Generate session ID if not provided
        const sessionId = providedSessionId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$chat$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSessionId"])();
        const conversationData = getChatbot(sessionId);
        conversationData.messageCount++;
        // Assess risk level based on message content
        const newRiskLevel = await assessRiskLevel(message, conversationData.riskLevel);
        conversationData.riskLevel = newRiskLevel;
        // Log concerning messages for monitoring (in production, use proper logging service)
        if (newRiskLevel === 'high') {
            console.warn(`HIGH RISK MESSAGE detected in session ${sessionId}:`, {
                timestamp: new Date().toISOString(),
                messageLength: message.length,
                sessionAge: new Date().getTime() - conversationData.createdAt.getTime()
            });
        }
        // Process the message through the chatbot
        let response = await conversationData.chatbot.processMessage(message);
        // Add crisis resources if needed
        response = addCrisisResources(response, newRiskLevel);
        // Prepare response data
        const responseData = {
            reply: response,
            sessionId,
            timestamp: new Date().toISOString(),
            messageCount: conversationData.messageCount
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(responseData);
    } catch (error) {
        console.error('Chat API Error:', error);
        // Provide a compassionate error message for users
        const fallbackResponse = {
            reply: "I'm sorry, I'm having some technical difficulties right now. Your feelings and what you're going through are important to me. Please try again in a moment, and if you need immediate support, remember that crisis resources are always available.",
            timestamp: new Date().toISOString(),
            error: true
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(fallbackResponse, {
            status: 500
        });
    }
}
async function GET() {
    const stats = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        activeSessions: conversations.size,
        uptime: process.uptime()
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(stats);
}
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');
        if (sessionId && conversations.has(sessionId)) {
            conversations.delete(sessionId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Session cleaned up successfully'
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Session not found'
        }, {
            status: 404
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Cleanup failed'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a202ab9e._.js.map