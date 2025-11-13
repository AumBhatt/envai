import React from 'react';
import { Button } from 'antd';
import { RobotOutlined, CloseOutlined } from '@ant-design/icons';
import { useAI } from '../useAI';
import './AIHeader.css';

export const AIHeader: React.FC = () => {
  const { toggleAIPanel, timeRange } = useAI();

  return (
    <>
      {/* Panel Header */}
      <div className="ai-assistant-header">
        <div className="ai-assistant-header-content">
          <RobotOutlined className="ai-assistant-header-icon" />
          <span className="ai-assistant-header-title">AI Assistant</span>
        </div>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={toggleAIPanel}
          className="ai-assistant-close-btn"
        />
      </div>

      {/* Time Range Indicator */}
      <div className="ai-assistant-time-range">
        Analyzing data for: <strong>{timeRange}</strong>
      </div>
    </>
  );
};
