import React from 'react';
import { Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useAI } from '../useAI';
import './AskAIButton.css';

interface AskAIButtonProps {
  context: string;
  question?: string;
}

export const AskAIButton: React.FC<AskAIButtonProps> = ({ context, question }) => {
  const { askAI } = useAI();

  return (
    <Button
      size="small"
      icon={<RobotOutlined className="ai-assistant-icon" />}
      onClick={() => askAI(question || `Tell me about my ${context.toLowerCase()}`, context)}
      className="ai-assistant-button"
    >
      Ask AI
    </Button>
  );
};
