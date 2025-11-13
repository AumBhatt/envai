import React from 'react';
import { Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useAI } from '../useAI';
import './AIWelcome.css';

export const AIWelcome: React.FC = () => {
  const { setQuery } = useAI();

  const quickQuestions = [
    "What's my current temperature?",
    "How much energy am I using?",
    "Is my system efficient?",
    "Show me usage patterns"
  ];

  return (
    <div className="ai-assistant-welcome">
      <RobotOutlined className="ai-assistant-welcome-icon" />
      <h3 className="ai-assistant-welcome-title">
        AI Assistant Ready
      </h3>
      <p className="ai-assistant-welcome-text">
        Ask me anything about your thermostat data, energy usage, or system performance.
      </p>
      
      <div className="ai-assistant-quick-questions">
        <h4>Quick questions:</h4>
        {quickQuestions.map((question, index) => (
          <Button
            key={index}
            type="text"
            size="small"
            onClick={() => setQuery(question)}
            className="ai-assistant-quick-question-btn"
          >
            "{question}"
          </Button>
        ))}
      </div>
    </div>
  );
};
