import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  FireOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  CloudOutlined
} from '@ant-design/icons';
import { useDashboard, useLatestReading } from '../../hooks';
import './KPICards.css';

const KPICards: React.FC = () => {
  const { data: dashboardData, loading: dashboardLoading } = useDashboard();
  const { data: latestReading, loading: latestLoading } = useLatestReading();

  return (
    <Row gutter={[16, 16]} className="kpi-cards-container">
      <Col xs={24} sm={12} md={6}>
        <Card className="kpi-card">
          <Statistic
            title="Current Temperature"
            value={latestReading?.currentTemp || 0}
            suffix="°F"
            prefix={<FireOutlined className="kpi-icon" />}
            loading={latestLoading}
            valueStyle={{ color: '#fff' }}
          />
          {latestReading && (
            <div className="kpi-subtitle">
              Target: {latestReading.targetTemp}°F
            </div>
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="kpi-card">
          <Statistic
            title="Daily Cost"
            value={dashboardData?.charts.kpiData.dailyCost.value || 0}
            prefix={<DollarOutlined className="kpi-icon" />}
            precision={2}
            loading={dashboardLoading}
            valueStyle={{ color: '#fff' }}
          />
          <div className="kpi-subtitle">
            Energy usage cost
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="kpi-card">
          <Statistic
            title="Efficiency Score"
            value={dashboardData?.charts.kpiData.efficiency.value || 0}
            suffix="%"
            prefix={<ThunderboltOutlined className="kpi-icon" />}
            loading={dashboardLoading}
            valueStyle={{ color: '#fff' }}
          />
          <div className="kpi-subtitle">
            {dashboardData?.charts.kpiData.efficiency.level || 'Calculating...'}
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="kpi-card">
          <Statistic
            title="Humidity"
            value={latestReading?.humidity || 0}
            suffix="%"
            prefix={<CloudOutlined className="kpi-icon" />}
            loading={latestLoading}
            valueStyle={{ color: '#fff' }}
          />
          <div className="kpi-subtitle">
            {latestReading && latestReading.humidity >= 40 && latestReading.humidity <= 60 
              ? 'Optimal range' 
              : 'Outside optimal range'}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default KPICards;
