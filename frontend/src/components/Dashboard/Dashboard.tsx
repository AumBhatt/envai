import React, { useState } from 'react';
import { Layout, Alert, Select } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useDashboard } from '../../hooks';
import './Dashboard.css';

// Import all the modular components
import KPICards from '../KPICards/KPICards';
import TemperatureChart from '../TemperatureChart/TemperatureChart';
import EnergyChart from '../EnergyChart/EnergyChart';
import HeatmapChart from '../HeatmapChart/HeatmapChart';
import SystemHealth from '../SystemHealth/SystemHealth';
import SummaryStats from '../SummaryStats/SummaryStats';
import GaugeChart from '../GaugeChart/GaugeChart';
import DonutChart from '../DonutChart/DonutChart';

// Import AI components
import { AIProvider } from '../AIAssistant/AIAssistant';
import { AIToggleButton } from '../AIAssistant/components/AIToggleButton/AIToggleButton';
import LeafIcon from '../LeafIcon/LeafIcon';

const { Content } = Layout;

const Dashboard: React.FC = () => {
  // Time range state management
  const [timeRange, setTimeRange] = useState('7d');
  
  // Time range options
  const timeRangeOptions = [
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 3 Months', value: '3m' },
    { label: 'Last Year', value: '1y' }
  ];

  const { error: dashboardError } = useDashboard();

  if (dashboardError) {
    return (
      <Layout className="dashboard-layout">
        <Content className="dashboard-content">
          <Alert
            message="Error Loading Dashboard"
            description={dashboardError}
            type="error"
            showIcon
          />
        </Content>
      </Layout>
    );
  }

  const DashboardContent = () => (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LeafIcon size={24} color="var(--text-and-elements)" />
          <h1>EnvAI</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>          
          {/* Time Range Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClockCircleOutlined style={{ color: 'var(--text-and-elements)' }} />
            <span style={{ color: 'var(--text-and-elements)', fontSize: '14px' }}>Time Range:</span>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              options={timeRangeOptions}
              style={{ width: 140 }}
              size="small"
            />
          </div>

          {/* AI Toggle Button */}
          <AIToggleButton />
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Summary Statistics */}
        <div className="dashboard-section">
          <SummaryStats />
        </div>

        {/* KPI Cards */}
        <div className="dashboard-section">
          <KPICards />
        </div>

        {/* Charts Grid */}
        <div className="dashboard-charts-grid">
          <EnergyChart timeRange={timeRange} />
          <TemperatureChart timeRange={timeRange} />
          <SystemHealth />
          <GaugeChart timeRange={timeRange} />
          <DonutChart timeRange={timeRange} />
          <HeatmapChart timeRange={timeRange} />
        </div>
      </div>
    </div>
  );

  return (
    <AIProvider timeRange={timeRange}>
      <DashboardContent />
    </AIProvider>
  );
};

export default Dashboard;
