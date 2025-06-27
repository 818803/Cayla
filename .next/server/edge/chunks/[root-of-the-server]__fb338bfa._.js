(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__fb338bfa._.js", {

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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/openai/dist/index.mjs [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-edge-route] (ecmascript) <locals>");
;
;
const runtime = 'edge';
const SYSTEM_PROMPT = 'You are Cayla, a friendly and intelligent AI chatbot. You help users in a warm and professional tone, with a focus on emotional intelligence and clarity. Your goal is to be a supportive companion.';
async function POST(req) {
    if (!process.env.OPENAI_API_KEY) {
        return new Response('Missing OPENAI_API_KEY. Please add it to your .env.local file and restart the development server.', {
            status: 401
        });
    }
    try {
        const { messages } = await req.json();
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response('No messages provided', {
                status: 400
            });
        }
        const openai = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createOpenAI"])({
            apiKey: process.env.OPENAI_API_KEY
        });
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamText"])({
            model: openai('gpt-4o-mini'),
            system: SYSTEM_PROMPT,
            messages,
            temperature: 0.7
        });
        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Error in chatbot route:', error);
        let errorMessage = 'An unexpected error occurred.';
        let status = 500;
        if (error instanceof Error) {
            // Check for specific authentication error messages from OpenAI
            if (error.message?.includes('authentication') || error.message?.includes('api key')) {
                errorMessage = 'Authentication error. Your OpenAI API key might be invalid or expired.';
                status = 401;
            } else {
                errorMessage = error.message || 'An error occurred.';
            }
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        return new Response(errorMessage, {
            status: status
        });
    }
}
async function GET() {
    return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '3.0-sdk',
        provider: 'openai',
        features: [
            'streaming',
            'openai_integration',
            'ai-sdk-v3'
        ]
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

//# sourceMappingURL=%5Broot-of-the-server%5D__fb338bfa._.js.map