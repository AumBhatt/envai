import React from 'react';
import { Card, Spin } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { Gauge } from '@ant-design/charts';
import { useGaugeChart } from '../../hooks';
import { AskAIButton } from '../AIAssistant/components/';
import './GaugeChart.css';

interface GaugeChartProps {
  timeRange?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ timeRange }) => {
  const { data: gaugeData, loading: gaugeLoading, error } = useGaugeChart(timeRange);

  // Prepare gauge chart data using the correct format for @ant-design/charts
  const gaugeChartConfig = React.useMemo(() => {
    if (!gaugeData || typeof gaugeData.value !== 'number') return null;

    return {
      autoFit: true,
      data: {
        target: gaugeData.value,
        total: gaugeData.max || 100,
        name: gaugeData.title || 'System Efficiency',
      },
      range: {
        color: ['#383e42', 'rgba(255,255,255,0.7)', '#fff'], // Using gray to white progression
      },
      statistic: {
        title: {
          content: gaugeData.title || 'System Efficiency',
        },
        content: {
          content: `${Math.round(gaugeData.value)}${gaugeData.unit || '%'}`,
        },
      },
    };
  }, [gaugeData]);

  return (
    <Card 
      className="gauge-chart"
      title={
        <div className="gauge-chart-header">
          <DashboardOutlined className="gauge-chart-icon" />
          System Efficiency
        </div>
      }
      loading={gaugeLoading}
      extra={<AskAIButton context="System Efficiency" question="How efficient is my system?" />}
    >
      {error ? (
        <div className="gauge-chart-error">
          Error: {error}
        </div>
      ) : gaugeChartConfig ? (
        <div className="gauge-chart-container">
          <Gauge {...gaugeChartConfig} height={200} />
        </div>
      ) : (
        <div className="gauge-chart-loading">
          <Spin size="large" />
        </div>
      )}
    </Card>
  );
};

export default GaugeChart;
