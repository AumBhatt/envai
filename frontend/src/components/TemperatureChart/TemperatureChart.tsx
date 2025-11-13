import React from 'react';
import { Card, Spin } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { useTemperatureChart } from '../../hooks';
import { AskAIButton } from '../AIAssistant/components/';
import './TemperatureChart.css';

interface TemperatureChartProps {
  timeRange?: string;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ timeRange }) => {
  const { data: temperatureData, loading: tempLoading } = useTemperatureChart(timeRange);

  // Prepare temperature chart data
  const temperatureChartConfig = React.useMemo(() => {
    if (!temperatureData) return null;

    const chartData: any[] = [];
    
    temperatureData.labels.forEach((label, index) => {
      temperatureData.datasets.forEach((dataset) => {
        chartData.push({
          time: label,
          temperature: dataset.data[index],
          type: dataset.label,
        });
      });
    });

    return {
      data: chartData,
      xField: 'time',
      yField: 'temperature',
      seriesField: 'type',
      smooth: true,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 1000,
        },
      },
      color: ['#fff', 'rgba(255,255,255,0.7)', '#383e42'], // Using white and gray variations
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        formatter: (datum: any) => ({
          name: datum.type,
          value: `${datum.temperature}°F`,
        }),
      },
    };
  }, [temperatureData]);

  return (
    <Card 
      className="temperature-chart"
      title={
        <div className="temperature-chart-header">
          <LineChartOutlined className="temperature-chart-icon" />
          Temperature Trends
        </div>
      }
      loading={tempLoading}
      extra={<AskAIButton context="Temperature Trends" question="What are my temperature patterns?" />}
    >
      {temperatureChartConfig ? (
        <div className="temperature-chart-container">
          <Line {...temperatureChartConfig } height={300} />
        </div>
      ) : (
        <div className="temperature-chart-loading">
          <Spin size="large" />
        </div>
      )}
    </Card>
  );
};

export default TemperatureChart;
