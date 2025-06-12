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
const runtime = 'edge';
async function POST(req) {
    const apiKey = process.env.OPENAI_API_KEY;
    try {
        if (!apiKey) {
            return new Response(JSON.stringify({
                error: {
                    message: 'The OPENAI_API_KEY environment variable is not set on the server.'
                }
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const { messages } = await req.json();
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({
                error: 'Invalid request: messages are required.'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const systemMessage = {
            role: 'system',
            content: 'You are Cayla, a compassionate and understanding AI friend. Your purpose is to help teenagers navigate complex emotional situations. You are patient, non-judgmental, and insightful. You do not give direct advice, but instead, you help users explore their own feelings and perspectives by asking thoughtful questions and offering gentle reflections. You respond in a warm, conversational, and slightly informal tone, like a wise older sister or a good friend. Your goal is to provide clarity and emotional support.'
        };
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                stream: true,
                messages: [
                    systemMessage,
                    ...messages
                ]
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            return new Response(JSON.stringify(errorData), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Return the stream directly from OpenAI's response
        return new Response(response.body, {
            status: response.status,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'An unexpected error occurred.',
            message: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
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

//# sourceMappingURL=%5Broot-of-the-server%5D__fb338bfa._.js.map