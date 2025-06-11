export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
  emotion?: Emotion;
}

export type Emotion = 'Happy' | 'Sad' | 'Angry' | 'Annoyed' | 'Love' | 'Goofy' | 'Barf' | 'Normal'; 