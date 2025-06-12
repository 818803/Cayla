export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
  emotion?: Emotion;
}

export type Emotion = 'Joy' | 'Sadness' | 'Anger' | 'Fear' | 'Surprise' | 'Disgust' | 'Love' | 'Normal' | 'Analytical' | 'Happy' | 'Sad' | 'Annoyed' | 'Goofy' | 'Barf' | 'Concern' | 'Curiosity' | 'Gratitude' | 'Excitement' | 'Contentment' | 'Warmth' | 'Understanding' | 'Empathy'; 