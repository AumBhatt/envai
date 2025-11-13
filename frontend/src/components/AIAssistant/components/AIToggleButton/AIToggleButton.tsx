import React from 'react';
import { Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useAI } from '../useAI';
import './AIToggleButton.css';

export const AIToggleButton: React.FC = () => {
  const { toggleAIPanel, isAIPanelOpen } = useAI();

  return (
    <div className="ai-toggle-button-container">
      {/* Glowing animation background */}
      <div className="ai-toggle-button-glow" />
      
      <Button
        type="primary"
        onClick={toggleAIPanel}
        className={`ai-toggle-button ${isAIPanelOpen ? 'active' : ''}`}
      >
        <div className="ai-toggle-button-content">
          <RobotOutlined className="ai-toggle-button-icon" />
          <span className="ai-toggle-button-text">
            {isAIPanelOpen ? 'AI Copilot' : 'AI Copilot'}
          </span>
        </div>
        
        {/* Shimmer effect */}
        <div className="ai-toggle-button-shimmer" />
        
      </Button>
    </div>
  );
};
