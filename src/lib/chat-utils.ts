// lib/chat-utils.ts
import { nanoid } from 'nanoid';

export interface Message {
  id: string;
  content: string;
  userId: string;
  timestamp: Date;
}

export interface MessageValidation {
  isValid: boolean;
  error?: string;
}

export interface CrisisKeywords {
  high: string[];
  medium: string[];
}

export function validateMessage(message: any): MessageValidation {
  if (!message) {
    return { isValid: false, error: 'Message is required' };
  }

  if (typeof message !== 'string') {
    return { isValid: false, error: 'Message must be a string' };
  }

  if (message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (message.length > 2000) {
    return { isValid: false, error: 'Message is too long (max 2000 characters)' };
  }

  // Check for potential spam or abuse
  const suspiciousPatterns = [
    /(.)\1{20,}/i, // Repeated characters
    /https?:\/\/[^\s]+/gi, // URLs (might want to allow these)
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      return { isValid: false, error: 'Message contains suspicious content' };
    }
  }

  return { isValid: true };
}

export function detectCrisisKeywords(message: string): CrisisKeywords {
  const highRiskKeywords = [
    'kill myself', 'end my life', 'want to die', 'suicide', 'suicidal',
    'hurt myself', 'cut myself', 'harm myself', 'self harm', 'overdose',
    'jump off', 'hanging myself', 'pills to die', 'razor', 'blade',
    'no point living', 'everyone would be better without me',
    'planning to', 'going to hurt', 'going to kill'
  ];

  const mediumRiskKeywords = [
    'worthless', 'hopeless', 'pointless', 'useless', 'burden',
    'hate myself', 'wish I was dead', 'disappear forever',
    'tired of living', 'can\'t go on', 'give up', 'nothing matters',
    'dark thoughts', 'scary thoughts', 'intrusive thoughts',
    'cutting', 'burning', 'hitting myself', 'self injury'
  ];

  const foundHigh = highRiskKeywords.filter(keyword => 
    message.includes(keyword)
  );

  const foundMedium = mediumRiskKeywords.filter(keyword => 
    message.includes(keyword)
  );

  return {
    high: foundHigh,
    medium: foundMedium
  };
}

export function generateSessionId(): string {
  return `session_${nanoid(16)}`;
}

export function sanitizeForLogging(message: string): string {
  // Remove or mask sensitive information for logging
  return message
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSN
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD]') // Credit card
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Email
    .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE]'); // Phone number
}

export function getEmotionalSupportResources(): string[] {
  return [
    "Crisis Text Line: Text HOME to 741741",
    "National Suicide Prevention Lifeline: 988",
    "SAMHSA National Helpline: 1-800-662-4357",
    "Teen Line: 1-800-852-8336 (6 PM - 10 PM PST)",
    "National Eating Disorders Association: 1-800-931-2237",
    "LGBTQ National Hotline: 1-888-843-4564",
    "National Domestic Violence Hotline: 1-800-799-7233"
  ];
}

export function formatCrisisResponse(userMessage: string, botResponse: string): string {
  const keywords = detectCrisisKeywords(userMessage.toLowerCase());
  
  if (keywords.high.length > 0) {
    return `${botResponse}\n\n🚨 **Immediate Support Available:**\n${getEmotionalSupportResources().slice(0, 3).map(resource => `• ${resource}`).join('\n')}\n\nYou matter, and help is available right now.`;
  }
  
  if (keywords.medium.length > 0) {
    return `${botResponse}\n\n💙 **Support Resources:**\n${getEmotionalSupportResources().slice(0, 2).map(resource => `• ${resource}`).join('\n')}`;
  }
  
  return botResponse;
}