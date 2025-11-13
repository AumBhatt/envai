import React from 'react';
import { AIHeader } from '../AIHeader/AIHeader';
import { AIConversation } from '../AIConversation/AIConversation';
import { AIInputArea } from '../AIInputArea/AIInputArea';
import './AIPanel.css';

export const AIPanel: React.FC = () => {
  return (
    <div className="ai-assistant-panel">
      <AIHeader />
      <AIConversation />
      <AIInputArea />
    </div>
  );
};
