'use client';

import { pipeline, Pipeline } from '@huggingface/transformers';

type Emotion = 'Happy' | 'Sad' | 'Angry' | 'Annoyed' | 'Love' | 'Goofy' | 'Barf' | 'Normal';

// Define a mapping from model labels to our custom emotions
const labelToEmotion: { [key: string]: Emotion } = {
  'joy': 'Happy',
  'love': 'Love',
  'sadness': 'Sad',
  'anger': 'Angry',
  'disgust': 'Barf',
  'fear': 'Annoyed', // Mapping fear to annoyed as a proxy
  'surprise': 'Goofy', // Mapping surprise to goofy as a proxy
};

class SentimentPipeline {
  static task = 'emotion';
  static model = 'j-hartmann/emotion-english-distilroberta-base';
  static instance: Pipeline | null = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

export async function detectEmotion(text: string): Promise<Emotion> {
  try {
    const classifier = await SentimentPipeline.getInstance();
    const results = await classifier(text, { topK: 1 });

    if (results && results.length > 0) {
      const topResult = results[0];
      const label = topResult.label.toLowerCase();
      // Use our mapping to get the final emotion, default to Normal
      return labelToEmotion[label] || 'Normal';
    }
  } catch (error) {
    console.error("Error during emotion detection:", error);
  }
  
  // Default to Normal if anything goes wrong
  return 'Normal';
}

export const avatarMap: Record<Emotion, string> = {
    Normal: '/avataaars.png',
    Happy: '/avataaars.png',
    Angry: '/avataaars copy.png',
    Sad: '/avataaars copy 2.png',
    Love: '/avataaars copy 3.png',
    Barf: '/avataaars copy 4.png',
    Annoyed: '/avataaars copy 5.png',
    Goofy: '/avataaars copy 6.png',
}; 