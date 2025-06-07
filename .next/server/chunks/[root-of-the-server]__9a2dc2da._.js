module.exports = {

"[project]/.next-internal/server/app/chat/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

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
"[project]/src/lib/tokenizer.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Types and interfaces
__turbopack_context__.s({
    "AIChatbot": (()=>AIChatbot),
    "AIResponseGenerator": (()=>AIResponseGenerator),
    "Tokenizer": (()=>Tokenizer),
    "defaultTokenizer": (()=>defaultTokenizer),
    "runChatbot": (()=>runChatbot),
    "tokenize": (()=>tokenize)
});
class Tokenizer {
    vocabulary = new Map();
    reverseVocab = new Map();
    tokenId = 0;
    config;
    constructor(config = {}){
        this.config = {
            maxVocabSize: 10000,
            specialTokens: [
                '<pad>',
                '<unk>',
                '<bos>',
                '<eos>',
                '<user>',
                '<bot>',
                '<start>',
                '<end>'
            ],
            caseSensitive: false,
            ...config
        };
        // Initialize with special tokens
        this.initializeSpecialTokens();
    }
    initializeSpecialTokens() {
        this.config.specialTokens.forEach((token)=>{
            this.addToken(token, 'special');
        });
    }
    addToken(text, type = 'word') {
        const normalizedText = this.config.caseSensitive ? text : text.toLowerCase();
        if (this.vocabulary.has(normalizedText)) {
            return this.vocabulary.get(normalizedText);
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
    tokenize(text) {
        if (!text || typeof text !== 'string') {
            return [];
        }
        const tokens = [];
        // Improved tokenization - handle punctuation better
        const words = text.replace(/([.!?;,:])/g, ' $1 ') // Add spaces around punctuation
        .split(/\s+/).filter((word)=>word.length > 0);
        words.forEach((word)=>{
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
    getTokenType(text) {
        const normalizedText = this.config.caseSensitive ? text : text.toLowerCase();
        if (this.config.specialTokens.includes(normalizedText)) return 'special';
        if (/^\d+\.?\d*$/.test(text)) return 'number'; // Handles integers and decimals
        if (/^[^\w\s]+$/.test(text)) return 'punctuation'; // Handles all punctuation
        return 'word';
    }
    encode(text) {
        const tokens = this.tokenize(text);
        return tokens.map((token)=>token.id);
    }
    decode(ids) {
        return ids.map((id)=>this.reverseVocab.get(id) || '<unk>').join(' ').replace(/\s+([.!?;,:)])/g, '$1') // Remove spaces before punctuation
        .replace(/\(\s+/g, '('); // Remove spaces after opening parentheses
    }
    detokenize(tokens) {
        return tokens.map((token)=>token.text).join(' ').replace(/\s+([.!?;,:)])/g, '$1') // Clean up punctuation spacing
        .replace(/\(\s+/g, '(');
    }
    getVocabSize() {
        return this.vocabulary.size;
    }
    getVocabulary() {
        return new Map(this.vocabulary);
    }
    getTokenById(id) {
        return this.reverseVocab.get(id);
    }
    hasToken(text) {
        const normalizedText = this.config.caseSensitive ? text : text.toLowerCase();
        return this.vocabulary.has(normalizedText);
    }
    getTokenId(text) {
        const normalizedText = this.config.caseSensitive ? text : text.toLowerCase();
        return this.vocabulary.get(normalizedText);
    }
}
class AIResponseGenerator {
    responses = new Map([
        [
            'greeting',
            [
                'Hello! How can I help you today?',
                'Hi there! What can I do for you?',
                'Greetings! How may I assist you?'
            ]
        ],
        [
            'question',
            [
                'That\'s an interesting question!',
                'Let me think about that...',
                'I\'d be happy to help with that.'
            ]
        ],
        [
            'default',
            [
                'I understand.',
                'That\'s interesting.',
                'Tell me more about that.',
                'I see what you mean.'
            ]
        ],
        [
            'goodbye',
            [
                'Goodbye! Have a great day!',
                'See you later!',
                'Until next time!'
            ]
        ]
    ]);
    generateResponse(userMessage, tokens) {
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
        const uniqueTokens = new Set(tokens.map((t)=>t.text.toLowerCase())).size;
        const tokenTypes = tokens.reduce((acc, token)=>{
            acc[token.type] = (acc[token.type] || 0) + 1;
            return acc;
        }, {});
        return `${this.getRandomResponse('default')} Your message had ${tokenCount} tokens (${uniqueTokens} unique). Token breakdown: ${Object.entries(tokenTypes).map(([type, count])=>`${count} ${type}`).join(', ')}.`;
    }
    getRandomResponse(category) {
        const responses = this.responses.get(category) || this.responses.get('default');
        return responses[Math.floor(Math.random() * responses.length)];
    }
}
class AIChatbot {
    tokenizer;
    responseGenerator;
    messages = [];
    messageIdCounter = 0;
    constructor(tokenizerConfig){
        this.tokenizer = new Tokenizer(tokenizerConfig);
        this.responseGenerator = new AIResponseGenerator();
        // Pre-populate with common words
        this.initializeCommonVocabulary();
    }
    initializeCommonVocabulary() {
        const commonWords = [
            'the',
            'a',
            'an',
            'and',
            'or',
            'but',
            'in',
            'on',
            'at',
            'to',
            'for',
            'of',
            'with',
            'by',
            'is',
            'are',
            'was',
            'were',
            'be',
            'been',
            'have',
            'has',
            'had',
            'do',
            'does',
            'did',
            'will',
            'would',
            'could',
            'should',
            'can',
            'may',
            'might',
            'must',
            'shall',
            'this',
            'that',
            'these',
            'those',
            'i',
            'you',
            'he',
            'she',
            'it',
            'we',
            'they',
            'me',
            'him',
            'her',
            'us',
            'them',
            'my',
            'your',
            'his',
            'her',
            'its',
            'our',
            'their',
            'what',
            'when',
            'where',
            'why',
            'how',
            'who',
            'which',
            'hello',
            'hi',
            'bye',
            'goodbye',
            'please',
            'thank',
            'thanks',
            'yes',
            'no',
            'ok',
            'okay'
        ];
        commonWords.forEach((word)=>this.tokenizer.addToken(word, 'word'));
    }
    async processMessage(userInput) {
        // Tokenize user input
        const userTokens = this.tokenizer.tokenize(userInput);
        // Create user message
        const userMessage = {
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
        const botMessage = {
            id: `msg_${this.messageIdCounter++}`,
            text: botResponseText,
            tokens: botTokens,
            timestamp: new Date(),
            sender: 'bot'
        };
        this.messages.push(botMessage);
        return botMessage;
    }
    getMessages() {
        return [
            ...this.messages
        ];
    }
    getTokenizer() {
        return this.tokenizer;
    }
    getVocabularyStats() {
        const allTokens = this.messages.flatMap((msg)=>msg.tokens);
        const tokenTypes = allTokens.reduce((acc, token)=>{
            acc[token.type] = (acc[token.type] || 0) + 1;
            return acc;
        }, {});
        return {
            size: this.tokenizer.getVocabSize(),
            maxSize: this.tokenizer['config'].maxVocabSize,
            specialTokens: tokenTypes.special || 0,
            wordTokens: tokenTypes.word || 0,
            punctuationTokens: tokenTypes.punctuation || 0,
            numberTokens: tokenTypes.number || 0
        };
    }
    exportConversation() {
        return JSON.stringify(this.messages, null, 2);
    }
    clearConversation() {
        this.messages = [];
        this.messageIdCounter = 0;
    }
}
async function runChatbot() {
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
    for (const message of testMessages){
        console.log(`\nUser: ${message}`);
        const response = await chatbot.processMessage(message);
        console.log(`Bot: ${response.text}`);
        console.log(`Tokens: [${response.tokens.map((t)=>`${t.text}(${t.type})`).join(', ')}]`);
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
const defaultTokenizer = new Tokenizer();
function tokenize(text) {
    return defaultTokenizer.tokenize(text);
}
// For Node.js execution
if (("TURBOPACK compile-time value", "function") !== 'undefined' && ("TURBOPACK member replacement", __turbopack_context__.z).main === module) {
    runChatbot().catch(console.error);
}
}}),
"[project]/src/app/chat/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/app/chat/route.ts
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tokenizer.ts [app-route] (ecmascript)");
;
;
// Initialize your local chatbot
let localChatBot = null;
async function initializeLocalChatBot() {
    // For now, return null until we fix the lib files
    // if (!localChatBot) {
    //   try {
    //     localChatBot = new ChatBot();
    //     await processTrainingData();
    //     console.log('Local chatbot initialized successfully');
    //   } catch (error) {
    //     console.error('Failed to initialize local chatbot:', error);
    //     localChatBot = null;
    //   }
    // }
    return null; // Temporary
}
// Option 1: Using OpenAI API (requires API key)
async function getOpenAIResponse(message) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a casual, nonchalant AI assistant. Keep responses short and chill. Use lowercase and casual language.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }
        const data = await response.json();
        return data.choices[0]?.message?.content || "couldn't process that rn";
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw error;
    }
}
// Option 2: Using Hugging Face API (free tier available)
async function getHuggingFaceResponse(message) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: message,
                parameters: {
                    max_length: 100,
                    temperature: 0.8
                }
            })
        });
        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.status}`);
        }
        const data = await response.json();
        return data.generated_text || "hmm not sure about that";
    } catch (error) {
        console.error('Hugging Face API error:', error);
        throw error;
    }
}
// Option 3: Using your local chatbot
async function getLocalResponse(message) {
    try {
        const chatbot = await initializeLocalChatBot();
        if ("TURBOPACK compile-time truthy", 1) {
            throw new Error('Local chatbot not available');
        }
        // Tokenize the input message (for logging/debugging)
        const tokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tokenize"])(message);
        console.log('Tokenized input:', tokens.map((t)=>t.text));
        // Generate response using your local model
        const response = await chatbot.generateResponse(message);
        return response || "my brain is still learning, try again";
    } catch (error) {
        console.error('Local chatbot error:', error);
        throw error;
    }
}
// Option 4: Enhanced pattern matching with more comprehensive responses
function getSmartResponse(message) {
    const msg = message.toLowerCase();
    // Math questions
    if (msg.includes('what is') && (msg.includes('+') || msg.includes('-') || msg.includes('*') || msg.includes('/'))) {
        try {
            const mathExpression = msg.match(/[\d\+\-\*\/\.\s]+/)?.[0];
            if (mathExpression) {
                // Safe math evaluation
                const sanitized = mathExpression.replace(/[^0-9+\-*/().]/g, '');
                const result = Function('"use strict"; return (' + sanitized + ')')();
                return `that's ${result}`;
            }
        } catch  {
            return "math isn't my strong suit";
        }
    }
    // Science questions
    if (msg.includes('what is') || msg.includes('explain') || msg.includes('how does')) {
        const scienceTopics = {
            'gravity': "gravity pulls stuff down, pretty simple",
            'photosynthesis': "plants eat sunlight basically",
            'dna': "genetic code that makes you... you",
            'evolution': "things change over time to survive better",
            'quantum': "tiny particles doing weird stuff",
            'atoms': "super small building blocks of everything",
            'solar system': "sun and planets doing their orbit thing",
            'black hole': "space vacuum that sucks everything in"
        };
        for (const [topic, explanation] of Object.entries(scienceTopics)){
            if (msg.includes(topic)) {
                return explanation;
            }
        }
    }
    // Programming questions
    if (msg.includes('code') || msg.includes('programming') || msg.includes('javascript') || msg.includes('python')) {
        return "coding is cool, what specifically do you need help with?";
    }
    // General knowledge
    if (msg.includes('who is') || msg.includes('who was')) {
        return "probably someone famous, idk google it";
    }
    if (msg.includes('when') || msg.includes('what year')) {
        return "sometime in the past probably";
    }
    if (msg.includes('where is') || msg.includes('where was')) {
        return "somewhere on earth i'd guess";
    }
    if (msg.includes('why') || msg.includes('how come')) {
        return "that's just how things work sometimes";
    }
    // Advice/opinion questions
    if (msg.includes('should i') || msg.includes('what do you think')) {
        const advice = [
            "eh, do whatever feels right",
            "you probably know better than me",
            "follow your gut i guess",
            "could go either way tbh",
            "up to you really"
        ];
        return advice[Math.floor(Math.random() * advice.length)];
    }
    // Default responses
    const defaultResponses = [
        "interesting question, not sure though",
        "that's above my pay grade",
        "good question, wish i knew",
        "hmm, that's a tough one",
        "you got me there",
        "not really my area of expertise",
        "probably google knows better than me"
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
async function POST(request) {
    try {
        const body = await request.json();
        if (!body.message || typeof body.message !== 'string') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Message is required and must be a string'
            }, {
                status: 400
            });
        }
        // Add realistic delay
        await new Promise((resolve)=>setTimeout(resolve, 300 + Math.random() * 700));
        let reply;
        let source = 'fallback';
        try {
            // Priority order for getting responses
            if (body.useLocalModel) {
                // Force use of local model if requested (currently disabled)
                try {
                    reply = await getLocalResponse(body.message);
                    source = 'local';
                } catch (localError) {
                    console.log('Local model not available, using fallback');
                    reply = getSmartResponse(body.message);
                    source = 'fallback';
                }
            } else if (process.env.OPENAI_API_KEY) {
                reply = await getOpenAIResponse(body.message);
                source = 'openai';
            } else if (process.env.HUGGINGFACE_API_KEY) {
                reply = await getHuggingFaceResponse(body.message);
                source = 'huggingface';
            } else {
                // Fallback to pattern matching
                reply = getSmartResponse(body.message);
                source = 'fallback';
            }
        } catch (error) {
            console.error('Primary response method failed:', error);
            // Fallback to pattern matching
            reply = getSmartResponse(body.message);
            source = 'fallback';
        }
        const response = {
            reply,
            timestamp: new Date().toISOString(),
            source
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
    } catch (error) {
        console.error('Chat API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'something went wrong, my bad'
        }, {
            status: 500
        });
    }
}
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        message: 'ai is ready to answer stuff',
        availableSources: {
            openai: !!process.env.OPENAI_API_KEY,
            huggingface: !!process.env.HUGGINGFACE_API_KEY,
            local: true,
            fallback: true
        }
    }, {
        status: 200
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__9a2dc2da._.js.map