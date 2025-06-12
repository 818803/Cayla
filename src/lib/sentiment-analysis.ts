'use client';

import { pipeline, Pipeline, TextClassificationPipeline } from '@huggingface/transformers';
import { Emotion } from './types';

// Define a mapping from model labels to our custom emotions
const emotionLabelMap: Record<string, Emotion> = {
  joy: 'Joy',
  sadness: 'Sadness',
  anger: 'Anger',
  fear: 'Fear',
  surprise: 'Surprise',
  disgust: 'Disgust',
  love: 'Love',
};

export async function detectEmotion(text: string): Promise<Emotion> {
    if (!text || text.trim().length === 0) {
        return 'Normal';
    }
    // Temporarily disabled for debugging.
    return 'Normal';
}

export const avatarMap: Record<Emotion, string> = {
    'Joy': '/assets/images/avataaars.png',
    'Sadness': '/assets/images/avataaars copy.png',
    'Anger': '/assets/images/avataaars copy 2.png',
    'Fear': '/assets/images/avataaars copy 3.png',
    'Surprise': '/assets/images/avataaars copy 4.png',
    'Disgust': '/assets/images/avataaars copy 5.png',
    'Love': '/assets/images/avataaars copy 6.png',
    'Normal': '/assets/images/avataaars.png',
    'Analytical': '/assets/images/avataaars.png',
    'Happy': '/assets/images/avataaars.png',
    'Sad': '/assets/images/avataaars copy.png',
    'Annoyed': '/assets/images/avataaars copy 2.png',
    'Goofy': '/assets/images/avataaars copy 4.png',
    'Barf': '/assets/images/avataaars copy 5.png',
    'Concern': '/assets/images/avataaars copy 3.png',
    'Curiosity': '/assets/images/avataaars.png',
    'Gratitude': '/assets/images/avataaars copy 6.png',
    'Excitement': '/assets/images/avataaars.png',
    'Contentment': '/assets/images/avataaars.png',
    'Warmth': '/assets/images/avataaars copy 6.png',
    'Understanding': '/assets/images/avataaars.png',
    'Empathy': '/assets/images/avataaars copy 6.png',
}; 