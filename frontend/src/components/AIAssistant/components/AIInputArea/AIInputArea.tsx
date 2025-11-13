import React from 'react';
import { Button, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAI } from '../useAI';
import './AIInputArea.css';

export const AIInputArea: React.FC = () => {
  const { query, setQuery, loading, handleQuery, handleKeyPress } = useAI();

  return (
    <div className="ai-assistant-input-area">
      <div className="ai-assistant-input-wrapper">
        <Input.TextArea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your thermostat data..."
          autoSize={{ minRows: 1, maxRows: 3 }}
          disabled={loading}
        />
        <Button
          icon={<SendOutlined />}
          onClick={() => handleQuery()}
          loading={loading}
          disabled={!query.trim()}
          className="ai-assistant-send-btn"
        />
      </div>
    </div>
  );
};
