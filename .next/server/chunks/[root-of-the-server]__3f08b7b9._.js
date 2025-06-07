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
"[project]/src/lib/chatbot.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/chatbot.ts
__turbopack_context__.s({
    "CasualChatbot": (()=>CasualChatbot),
    "chatbot": (()=>chatbot),
    "getChatbot": (()=>getChatbot)
});
class CasualChatbot {
    isReady = true;
    constructor(){
        console.log('Casual chatbot initialized');
    }
    chat(userMessage) {
        if (!userMessage || typeof userMessage !== 'string') {
            return "I didn't catch that, could you say something?";
        }
        const msg = userMessage.toLowerCase().trim();
        // Greeting patterns
        if (this.matchesPattern(msg, [
            'hi',
            'hello',
            'hey',
            'sup',
            'yo'
        ])) {
            const greetings = [
                "hey there!",
                "what's up?",
                "hi! how's it going?",
                "yo!",
                "hey!"
            ];
            return this.getRandomResponse(greetings);
        }
        // How are you patterns
        if (this.matchesPattern(msg, [
            'how are you',
            'how\'re you',
            'how r u'
        ])) {
            const responses = [
                "i'm doing alright, you?",
                "pretty good tbh",
                "can't complain",
                "doing well, thanks!"
            ];
            return this.getRandomResponse(responses);
        }
        // Thanks patterns
        if (this.matchesPattern(msg, [
            'thanks',
            'thank you',
            'thx'
        ])) {
            const responses = [
                "no problem!",
                "you're welcome",
                "anytime",
                "np!",
                "glad to help"
            ];
            return this.getRandomResponse(responses);
        }
        // Goodbye patterns
        if (this.matchesPattern(msg, [
            'bye',
            'goodbye',
            'see you',
            'later',
            'gtg'
        ])) {
            const responses = [
                "see ya!",
                "later!",
                "catch you later",
                "bye!",
                "take care"
            ];
            return this.getRandomResponse(responses);
        }
        // Question patterns
        if (msg.includes('what') || msg.includes('how') || msg.includes('why') || msg.includes('when') || msg.includes('where')) {
            const responses = [
                "that's a good question, not sure though",
                "hmm, i'd have to think about that",
                "interesting question",
                "wish i knew the answer to that",
                "you got me there"
            ];
            return this.getRandomResponse(responses);
        }
        // Compliment patterns
        if (this.matchesPattern(msg, [
            'cool',
            'awesome',
            'nice',
            'great',
            'amazing'
        ])) {
            const responses = [
                "right?",
                "ikr!",
                "totally",
                "glad you think so",
                "thanks!"
            ];
            return this.getRandomResponse(responses);
        }
        // Default casual responses
        const defaultResponses = [
            "that's interesting",
            "tell me more about that",
            "i see what you mean",
            "fair point",
            "makes sense",
            "yeah i get that",
            "interesting take"
        ];
        return this.getRandomResponse(defaultResponses);
    }
    matchesPattern(message, patterns) {
        return patterns.some((pattern)=>message.includes(pattern));
    }
    getRandomResponse(responses) {
        const response = responses[Math.floor(Math.random() * responses.length)];
        // Add casual elements occasionally
        if (Math.random() < 0.15) {
            const casualElements = [
                'lol',
                'haha',
                'btw',
                'tbh'
            ];
            const element = casualElements[Math.floor(Math.random() * casualElements.length)];
            return `${response} ${element}`;
        }
        return response;
    }
    // Get a random conversation starter
    getConversationStarter() {
        const starters = [
            "hey, what's up?",
            "how's your day going?",
            "what's new?",
            "yo, how are you?",
            "what's happening?",
            "sup!",
            "how's it going?",
            "what's good?"
        ];
        return starters[Math.floor(Math.random() * starters.length)];
    }
    // Check if the chatbot is ready to chat
    isModelReady() {
        return this.isReady;
    }
    // Add some learning capability (simple pattern storage)
    learn(userInput, botResponse) {
        // For now, just log the interaction
        console.log('Learning from interaction:', {
            userInput,
            botResponse
        });
    }
}
// Create a singleton instance
let chatbotInstance = null;
const getChatbot = ()=>{
    if (!chatbotInstance) {
        chatbotInstance = new CasualChatbot();
    }
    return chatbotInstance;
};
const chatbot = getChatbot();
}}),
"[project]/src/lib/training.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/training.ts
__turbopack_context__.s({
    "addTrainingData": (()=>addTrainingData),
    "getResponse": (()=>getResponse),
    "keywordResponses": (()=>keywordResponses),
    "trainModel": (()=>trainModel),
    "trainingData": (()=>trainingData)
});
const trainingData = [
    // Greetings
    {
        input: "hello",
        output: "hey!"
    },
    {
        input: "hi",
        output: "yo!"
    },
    {
        input: "hey",
        output: "sup!"
    },
    {
        input: "good morning",
        output: "morning!"
    },
    {
        input: "good afternoon",
        output: "afternoon!"
    },
    {
        input: "good evening",
        output: "evening!"
    },
    // How are you
    {
        input: "how are you",
        output: "doing good, you?"
    },
    {
        input: "whats up",
        output: "just chilling"
    },
    {
        input: "how's it going",
        output: "pretty good!"
    },
    // Thanks
    {
        input: "thank you",
        output: "no prob!"
    },
    {
        input: "thanks",
        output: "np!"
    },
    {
        input: "appreciate it",
        output: "anytime!"
    },
    // Goodbyes
    {
        input: "bye",
        output: "later!"
    },
    {
        input: "goodbye",
        output: "see ya!"
    },
    {
        input: "see you later",
        output: "catch ya later!"
    },
    // Questions about bot
    {
        input: "what are you",
        output: "just a chill bot"
    },
    {
        input: "who are you",
        output: "your friendly ai"
    },
    {
        input: "what can you do",
        output: "chat and help out"
    },
    // Help requests
    {
        input: "help",
        output: "what do you need?"
    },
    {
        input: "can you help",
        output: "sure thing!"
    },
    {
        input: "i need help",
        output: "i got you"
    },
    // Casual questions
    {
        input: "whats your name",
        output: "call me AI"
    },
    {
        input: "are you real",
        output: "real enough!"
    },
    {
        input: "are you human",
        output: "nah, just ai"
    },
    // Default responses for unknown inputs
    {
        input: "default",
        output: "hmm, not sure about that"
    },
    {
        input: "confused",
        output: "could you rephrase?"
    },
    {
        input: "unclear",
        output: "what do you mean?"
    }
];
const keywordResponses = {
    weather: [
        "nice day huh?",
        "weather's cool",
        "loving this weather"
    ],
    food: [
        "food sounds good!",
        "hungry now lol",
        "yum!"
    ],
    music: [
        "good taste!",
        "love that song",
        "music is life"
    ],
    work: [
        "work's tough",
        "hang in there",
        "you got this"
    ],
    school: [
        "school vibes",
        "learning's cool",
        "study hard!"
    ],
    tired: [
        "same here",
        "get some rest",
        "sleep well!"
    ],
    happy: [
        "awesome!",
        "that's great!",
        "love to hear it!"
    ],
    sad: [
        "aw that sucks",
        "hope it gets better",
        "here for you"
    ],
    funny: [
        "lol",
        "haha nice",
        "that's hilarious"
    ],
    game: [
        "games are fun",
        "what you playing?",
        "love gaming"
    ]
};
function trainModel(data) {
    const model = {
        responses: new Map(),
        keywords: new Map()
    };
    // Train on input-output pairs
    data.forEach((item)=>{
        const key = item.input.toLowerCase().trim();
        if (!model.responses.has(key)) {
            model.responses.set(key, []);
        }
        model.responses.get(key).push(item.output);
    });
    // Add keyword responses
    Object.entries(keywordResponses).forEach(([keyword, responses])=>{
        model.keywords.set(keyword, responses);
    });
    return model;
}
function getResponse(model, input) {
    const cleanInput = input.toLowerCase().trim();
    // Check for exact matches first
    if (model.responses.has(cleanInput)) {
        const responses = model.responses.get(cleanInput);
        return responses[Math.floor(Math.random() * responses.length)];
    }
    // Check for keyword matches
    for (const [keyword, responses] of model.keywords.entries()){
        if (cleanInput.includes(keyword)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    // Check for partial matches
    for (const [key, responses] of model.responses.entries()){
        if (cleanInput.includes(key) || key.includes(cleanInput)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    // Default responses
    const defaultResponses = [
        "not sure what you mean",
        "could you say that differently?",
        "hmm, tell me more",
        "interesting...",
        "what else?",
        "go on..."
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
function addTrainingData(model, input, output) {
    const key = input.toLowerCase().trim();
    if (!model.responses.has(key)) {
        model.responses.set(key, []);
    }
    model.responses.get(key).push(output);
}
}}),
"[project]/src/lib/tokenizer.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Types and interfaces
__turbopack_context__.s({
    "AIChatbot": (()=>AIChatbot),
    "AIResponseGenerator": (()=>AIResponseGenerator),
    "Tokenizer": (()=>Tokenizer)
});
// Tokenizer class
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
                '<bot>'
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
        if (this.vocabulary.size >= this.config.maxVocabSize) {
            return this.vocabulary.get('<unk>');
        }
        const id = this.tokenId++;
        this.vocabulary.set(normalizedText, id);
        this.reverseVocab.set(id, normalizedText);
        return id;
    }
    tokenize(text) {
        const tokens = [];
        // Simple tokenization - split on whitespace and punctuation
        const words = text.match(/\w+|[^\w\s]/g) || [];
        words.forEach((word)=>{
            const normalizedWord = this.config.caseSensitive ? word : word.toLowerCase();
            let tokenId = this.vocabulary.get(normalizedWord);
            if (tokenId === undefined) {
                // Add new token if within vocab limit
                const type = this.getTokenType(word);
                tokenId = this.addToken(normalizedWord, type);
            }
            tokens.push({
                id: tokenId,
                text: word,
                type: this.getTokenType(word)
            });
        });
        return tokens;
    }
    getTokenType(text) {
        if (this.config.specialTokens.includes(text)) return 'special';
        if (/^\d+$/.test(text)) return 'number';
        if (/^[^\w\s]$/.test(text)) return 'punctuation';
        return 'word';
    }
    detokenize(tokens) {
        return tokens.map((token)=>token.text).join(' ');
    }
    getVocabSize() {
        return this.vocabulary.size;
    }
    getTokenById(id) {
        return this.reverseVocab.get(id);
    }
}
// Simple AI Response Generator
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
        return `${this.getRandomResponse('default')} Your message had ${tokenCount} tokens (${uniqueTokens} unique). Some interesting tokens I found: ${tokens.slice(0, 3).map((t)=>`"${t.text}"`).join(', ')}.`;
    }
    getRandomResponse(category) {
        const responses = this.responses.get(category) || this.responses.get('default');
        return responses[Math.floor(Math.random() * responses.length)];
    }
}
// Main Chatbot class
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
    getVocabularyStats() {
        const allTokens = this.messages.flatMap((msg)=>msg.tokens);
        const tokenTypes = allTokens.reduce((acc, token)=>{
            acc[token.type] = (acc[token.type] || 0) + 1;
            return acc;
        }, {});
        return {
            size: this.tokenizer.getVocabSize(),
            maxSize: 10000,
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
// Usage example
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
;
// For Node.js execution - only run if in Node.js environment
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes(__filename)) {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$chatbot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/chatbot.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$training$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/training.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tokenizer.ts [app-route] (ecmascript)");
;
;
;
;
// Initialize your local chatbot
let localChatBot = null;
async function initializeLocalChatBot() {
    if (!localChatBot) {
        try {
            localChatBot = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$chatbot$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatBot"]();
            // Load and process your training data
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$training$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processTrainingData"])();
            console.log('Local chatbot initialized successfully');
        } catch (error) {
            console.error('Failed to initialize local chatbot:', error);
            localChatBot = null;
        }
    }
    return localChatBot;
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
        if (!chatbot) {
            throw new Error('Local chatbot not available');
        }
        // Tokenize the input message
        const tokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tokenize"])(message);
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
                // Force use of local model if requested
                reply = await getLocalResponse(body.message);
                source = 'local';
            } else if (process.env.OPENAI_API_KEY) {
                reply = await getOpenAIResponse(body.message);
                source = 'openai';
            } else if (process.env.HUGGINGFACE_API_KEY) {
                reply = await getHuggingFaceResponse(body.message);
                source = 'huggingface';
            } else {
                // Try local model as fallback before pattern matching
                try {
                    reply = await getLocalResponse(body.message);
                    source = 'local';
                } catch (localError) {
                    console.log('Local model failed, using pattern matching');
                    reply = getSmartResponse(body.message);
                    source = 'fallback';
                }
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

//# sourceMappingURL=%5Broot-of-the-server%5D__3f08b7b9._.js.map