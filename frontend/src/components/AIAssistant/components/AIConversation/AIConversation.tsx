import React from 'react';
import { useAI } from '../useAI';
import { AIWelcome } from '../AIWelcome/AIWelcome';
import { AIMessageList } from '../AIMessageList/AIMessageList';
import './AIConversation.css';

export const AIConversation: React.FC = () => {
  const { conversationHistory } = useAI();

  return (
    <div className="ai-assistant-conversation">
      {conversationHistory.length === 0 ? (
        <AIWelcome />
      ) : (
        <AIMessageList />
      )}
    </div>
  );
};
