// lib/training.ts
export interface TrainingData {
  input: string;
  output: string;
}

export interface ChatbotModel {
  responses: Map<string, string[]>;
  keywords: Map<string, string[]>;
}

// Simple pattern-based training data for casual, short responses
export const trainingData: TrainingData[] = [
  // WTV
];

// Simple keyword matching for casual responses
export const keywordResponses = {
  weather: ["nice day huh?", "weather's cool", "loving this weather"],
  food: ["food sounds good!", "hungry now lol", "yum!"],
  music: ["good taste!", "love that song", "music is life"],
  work: ["work's tough", "hang in there", "you got this"],
  school: ["school vibes", "learning's cool", "study hard!"],
  tired: ["same here", "get some rest", "sleep well!"],
  happy: ["awesome!", "that's great!", "love to hear it!"],
  sad: ["aw that sucks", "hope it gets better", "here for you"],
  funny: ["lol", "haha nice", "that's hilarious"],
  game: ["games are fun", "what you playing?", "love gaming"],
};

export function trainModel(data: TrainingData[]): ChatbotModel {
  const model: ChatbotModel = {
    responses: new Map(),
    keywords: new Map(),
  };

  // Train on input-output pairs
  data.forEach(item => {
    const key = item.input.toLowerCase().trim();
    if (!model.responses.has(key)) {
      model.responses.set(key, []);
    }
    model.responses.get(key)!.push(item.output);
  });

  // Add keyword responses
  Object.entries(keywordResponses).forEach(([keyword, responses]) => {
    model.keywords.set(keyword, responses);
  });

  return model;
}

export function getResponse(model: ChatbotModel, input: string): string {
  const cleanInput = input.toLowerCase().trim();
  
  // Check for exact matches first
  if (model.responses.has(cleanInput)) {
    const responses = model.responses.get(cleanInput)!;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Check for keyword matches
  for (const [keyword, responses] of model.keywords.entries()) {
    if (cleanInput.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Check for partial matches
  for (const [key, responses] of model.responses.entries()) {
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
    "go on...",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export function addTrainingData(model: ChatbotModel, input: string, output: string) {
  const key = input.toLowerCase().trim();
  if (!model.responses.has(key)) {
    model.responses.set(key, []);
  }
  model.responses.get(key)!.push(output);
}

// src/lib/training.ts

import { ChatBot, TrainingExample } from './chatbot';
import fs from 'fs';
import path from 'path';

export interface TrainingData {
  conversations: Array<{
    input: string;
    output: string;
    context?: string;
  }>;
}

export async function loadTrainingData(): Promise<TrainingExample[]> {
  try {
    // Try to load from the data directory
    const dataPath = path.join(process.cwd(), 'src', 'data', 'training-data.json');
    
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const trainingData: TrainingData = JSON.parse(rawData);
      
      console.log(`Loaded ${trainingData.conversations.length} training examples`);
      return trainingData.conversations;
    } else {
      console.log('Training data file not found, using default examples');
      return getDefaultTrainingData();
    }
  } catch (error) {
    console.error('Error loading training data:', error);
    return getDefaultTrainingData();
  }
}

function getDefaultTrainingData(): TrainingExample[] {
  return [
    // Greetings
    { input: "hello", output: "hey! how's it going?" },
    { input: "hi there", output: "hello! what can i help you with?" },
    { input: "good morning", output: "morning! hope you're having a good day" },
    { input: "what's up", output: "not much, just here to chat. what about you?" },
    
    // Questions about the AI
    { input: "what are you", output: "i'm an ai assistant, here to help and chat" },
    { input: "who made you", output: "i was created to be a helpful chatbot" },
    { input: "what can you do", output: "i can chat, answer questions, and help with various topics" },
    { input: "are you real", output: "i'm as real as any ai can be, i guess" },
    
    // Common questions
    { input: "how's the weather", output: "i wish i could check that for you, but i don't have access to weather data" },
    { input: "what time is it", output: "i don't have access to real-time data, sorry" },
    { input: "tell me a joke", output: "why don't scientists trust atoms? because they make up everything!" },
    { input: "what's your favorite color", output: "i'd probably go with blue, seems like a nice calming color" },
    
    // Helpful responses
    { input: "i need help", output: "sure! what do you need help with?" },
    { input: "can you help me", output: "absolutely! what's on your mind?" },
    { input: "i have a question", output: "go ahead, i'm listening" },
    { input: "i'm confused", output: "no worries, what's confusing you?" },
    
    // Casual conversation
    { input: "how was your day", output: "every day is pretty much the same for me, but thanks for asking!" },
    { input: "what do you think", output: "that's a good question, what's your take on it?" },
    { input: "that's cool", output: "right? pretty neat stuff" },
    { input: "interesting", output: "glad you find it interesting! anything else you'd like to know?" },
    
    // Farewells
    { input: "goodbye", output: "see you later! feel free to come back anytime" },
    { input: "bye", output: "bye! have a great day" },
    { input: "talk to you later", output: "sounds good, catch you later!" },
    { input: "see you", output: "see you around!" },
    
    // Thank you responses
    { input: "thank you", output: "you're welcome! happy to help" },
    { input: "thanks", output: "no problem at all!" },
    { input: "i appreciate it", output: "glad i could help!" },
    
    // Programming related
    { input: "what is javascript", output: "javascript is a programming language used mainly for web development" },
    { input: "how do i code", output: "start with the basics - pick a language like python or javascript and practice!" },
    { input: "what is programming", output: "programming is writing instructions for computers to follow" },
    
    // General knowledge (casual responses)
    { input: "what is ai", output: "artificial intelligence - basically computers trying to be smart like humans" },
    { input: "explain machine learning", output: "it's when computers learn patterns from data instead of being explicitly programmed" },
    { input: "what is the internet", output: "a global network that connects computers so they can share information" }
  ];
}

export async function processTrainingData(): Promise<void> {
  try {
    const trainingExamples = await loadTrainingData();
    
    if (trainingExamples.length === 0) {
      console.log('No training data available');
      return;
    }
    
    // You can add additional processing here if needed
    console.log(`Processed ${trainingExamples.length} training examples`);
    
    // The actual training will be done when the ChatBot is initialized
    // This function just loads and processes the data
    
  } catch (error) {
    console.error('Error processing training data:', error);
  }
}

export async function trainChatBot(chatBot: ChatBot): Promise<void> {
  try {
    const trainingExamples = await loadTrainingData();
    await chatBot.train(trainingExamples);
    
    const stats = chatBot.getStats();
    console.log('Training completed:', stats);
    
  } catch (error) {
    console.error('Error training chatbot:', error);
    throw error;
  }
}