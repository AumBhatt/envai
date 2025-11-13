import { createContext, useContext } from 'react';

export interface AIMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
  context?: string;
}

export interface AIContextType {
  isAIPanelOpen: boolean;
  toggleAIPanel: () => void;
  askAI: (question: string, context?: string) => void;
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  conversationHistory: AIMessage[];
  handleQuery: (queryText?: string, context?: string) => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  timeRange: string;
}

export const AIContext = createContext<AIContextType | null>(null);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
};
