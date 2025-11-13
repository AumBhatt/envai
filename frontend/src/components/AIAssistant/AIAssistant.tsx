import React, { useState } from 'react';
import { message } from 'antd';
import { AIContext } from './components/AIContext';
import type { AIContextType, AIMessage } from './components/AIContext';
import { AIPanel } from './components/AIPanel/AIPanel';
import { API_BASE_URL } from '../../config/api';
import './AIAssistant.css';

interface AIProviderProps {
  children: React.ReactNode;
  timeRange: string;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children, timeRange }) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([]);

  const toggleAIPanel = () => {
    setIsAIPanelOpen(!isAIPanelOpen);
  };

  const askAI = (question: string, context?: string) => {
    setIsAIPanelOpen(true);
    setQuery(question);
    if (context) {
      // Auto-submit the question with context
      handleQuery(question, context);
    }
  };

  const handleQuery = async (queryText?: string, context?: string) => {
    const questionToAsk = queryText || query;
    
    if (!questionToAsk.trim()) {
      message.warning('Please enter a question');
      return;
    }

    setLoading(true);
    const userMessage: AIMessage = {
      type: 'user',
      message: questionToAsk,
      timestamp: new Date().toLocaleTimeString(),
      context
    };

    setConversationHistory(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: context ? `${context}: ${questionToAsk}` : questionToAsk,
          timeRange: timeRange
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: AIMessage = {
        type: 'ai',
        message: data.answer,
        timestamp: new Date().toLocaleTimeString()
      };

      setConversationHistory(prev => [...prev, aiMessage]);
      setQuery('');
      
    } catch (error) {
      console.error('AI query error:', error);
      message.error('Failed to get AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  const contextValue: AIContextType = {
    isAIPanelOpen,
    toggleAIPanel,
    askAI,
    query,
    setQuery,
    loading,
    conversationHistory,
    handleQuery,
    handleKeyPress,
    timeRange
  };

  return (
    <AIContext.Provider value={contextValue}>
      <div className="ai-assistant-container">
        {/* Main Content */}
        <div className={`ai-assistant-main-content ${isAIPanelOpen ? 'panel-open' : ''}`}>
          {children}
        </div>

        {/* AI Panel */}
        {isAIPanelOpen && <AIPanel />}
      </div>
    </AIContext.Provider>
  );
};
