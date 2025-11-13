import React from 'react';
import type { AIMessage as AIMessageType } from '../AIContext';
import './AIMessage.css';

interface AIMessageProps {
  message: AIMessageType;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  // Render AI messages as HTML, user messages as plain text
  const renderMessageContent = () => {
    if (message.type === 'ai') {
      // Safely render HTML for AI responses
      return (
        <div 
          className="ai-message-content"
          dangerouslySetInnerHTML={{ __html: message.message }}
        />
      );
    } else {
      // Render user messages as plain text
      return <div className="user-message-content">{message.message}</div>;
    }
  };

  return (
    <div className={`ai-assistant-message-wrapper ${message.type}`}>
      <div className={`ai-assistant-message ${message.type}`}>
        {message.context && (
          <div className="ai-assistant-message-context">
            {message.context}
          </div>
        )}
        {renderMessageContent()}
        <div className={`ai-assistant-message-timestamp ${message.type}`}>
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
