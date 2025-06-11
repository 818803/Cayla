'use client';

export interface Conversation {
  id: string;
  title: string;
  lastActivity: number;
}

const HISTORY_KEY = 'cayla-chat-history';

/**
 * Retrieves the conversation history from localStorage.
 * Ensures it only runs on the client-side.
 */
export function getHistory(): Conversation[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) return [];
    const history = JSON.parse(historyJson) as Conversation[];
    // Sort by last activity, newest first
    return history.sort((a, b) => b.lastActivity - a.lastActivity);
  } catch (error) {
    console.error("Failed to parse conversation history:", error);
    return [];
  }
}

/**
 * Adds or updates a conversation in the history.
 * If a conversation with the same ID exists, it updates its title and lastActivity.
 */
export function saveConversation(id: string, title: string) {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  const existingIndex = history.findIndex(c => c.id === id);
  const now = Date.now();

  if (existingIndex !== -1) {
    // Update existing conversation
    history[existingIndex].title = title;
    history[existingIndex].lastActivity = now;
  } else {
    // Add new conversation
    history.push({ id, title, lastActivity: now });
  }

  // Keep history sorted
  const sortedHistory = history.sort((a, b) => b.lastActivity - a.lastActivity);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sortedHistory));
  } catch (error) {
    console.error("Failed to save conversation history:", error);
  }
}

/**
 * Deletes a conversation from the history.
 */
export function deleteConversation(id: string) {
    if (typeof window === 'undefined') return;

    let history = getHistory();
    history = history.filter(c => c.id !== id);

    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to delete conversation from history:", error);
    }
}

/**
 * Clears the entire chat history.
 */
export function clearHistory() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear conversation history:", error);
  }
} 