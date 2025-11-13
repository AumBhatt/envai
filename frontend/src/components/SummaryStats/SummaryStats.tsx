import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { useDashboard } from '../../hooks';
import './SummaryStats.css';

const SummaryStats: React.FC = () => {
  const { data: dashboardData } = useDashboard();

  if (!dashboardData) return null;

  return (
    <Row gutter={[16, 16]} className="summary-stats-container">
      <Col span={24}>
        <Card className="summary-stats" title="Summary Statistics">
          <Row gutter={[16, 16]} className="summary-stats-content">
            <Col xs={24} sm={8}>
              <Statistic
                title="Total Energy Usage"
                value={dashboardData.summary.totalEnergy}
                suffix="kWh"
                precision={1}
                valueStyle={{ color: '#fff' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Average Temperature"
                value={dashboardData.summary.avgTemp}
                suffix="°F"
                precision={1}
                valueStyle={{ color: '#fff' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Data Points"
                value={dashboardData.summary.dataPoints}
                suffix="readings"
                valueStyle={{ color: '#fff' }}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryStats;
