import React from 'react';
import { Card, Statistic, Alert, Spin } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { useSystemHealth } from '../../hooks';
import './SystemHealth.css';

const SystemHealth: React.FC = () => {
  const { data: healthData, loading: healthLoading } = useSystemHealth();

  return (
    <Card 
      className="system-health"
      title={
        <div className="system-health-header">
          <SafetyCertificateOutlined className="system-health-icon" />
          System Health
        </div>
      }
      loading={healthLoading}
      style={{ height: '100%' }}
    >
      {healthData ? (
        <div className="system-health-content">
          <div className="system-health-status">
            <Statistic
              title="Overall Status"
              value={healthData.overall.replace('_', ' ').toUpperCase()}
              valueStyle={{ 
                color: '#fff',
                fontSize: '18px'
              }}
            />
          </div>
          
          <div className="system-health-components">
            <h4>Component Status:</h4>
            {Object.entries(healthData.components).map(([key, component]) => (
              <div key={key} className="component-status-item">
                <span className="component-name">{key}:</span>
                <span className="component-status">
                  {component.status?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
            ))}
          </div>

          {healthData.recommendations.length > 0 && (
            <div className="system-health-recommendations">
              <h4>Recommendations:</h4>
              {healthData.recommendations.map((rec, index) => (
                <Alert
                  key={index}
                  message={rec}
                  type="info"
                  style={{ marginBottom: '8px' }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="system-health-loading">
          <Spin size="large" />
        </div>
      )}
    </Card>
  );
};

export default SystemHealth;
