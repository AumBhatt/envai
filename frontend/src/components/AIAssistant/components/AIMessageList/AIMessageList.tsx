import React from 'react';
import { Spin } from 'antd';
import { useAI } from '../useAI';
import { AIMessage } from './AIMessage.tsx';
import './AIMessageList.css';

export const AIMessageList: React.FC = () => {
  const { conversationHistory, loading } = useAI();

  return (
    <div className="ai-assistant-messages">
      {conversationHistory.map((item, index) => (
        <AIMessage key={index} message={item} />
      ))}
      {loading && (
        <div className="ai-assistant-loading">
          <div className="ai-assistant-loading-content">
            <Spin size="small" />
            <span className="ai-assistant-loading-text">Thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
};
