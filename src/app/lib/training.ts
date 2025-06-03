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
  // Greetings
  { input: "hello", output: "hey!" },
  { input: "hi", output: "yo!" },
  { input: "hey", output: "sup!" },
  { input: "good morning", output: "morning!" },
  { input: "good afternoon", output: "afternoon!" },
  { input: "good evening", output: "evening!" },
  
  // How are you
  { input: "how are you", output: "doing good, you?" },
  { input: "whats up", output: "just chilling" },
  { input: "how's it going", output: "pretty good!" },
  
  // Thanks
  { input: "thank you", output: "no prob!" },
  { input: "thanks", output: "np!" },
  { input: "appreciate it", output: "anytime!" },
  
  // Goodbyes
  { input: "bye", output: "later!" },
  { input: "goodbye", output: "see ya!" },
  { input: "see you later", output: "catch ya later!" },
  
  // Questions about bot
  { input: "what are you", output: "just a chill bot" },
  { input: "who are you", output: "your friendly ai" },
  { input: "what can you do", output: "chat and help out" },
  
  // Help requests
  { input: "help", output: "what do you need?" },
  { input: "can you help", output: "sure thing!" },
  { input: "i need help", output: "i got you" },
  
  // Casual questions
  { input: "whats your name", output: "call me AI" },
  { input: "are you real", output: "real enough!" },
  { input: "are you human", output: "nah, just ai" },
  
  // Default responses for unknown inputs
  { input: "default", output: "hmm, not sure about that" },
  { input: "confused", output: "could you rephrase?" },
  { input: "unclear", output: "what do you mean?" },
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