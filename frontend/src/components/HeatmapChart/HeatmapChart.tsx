import React from 'react';
import { Card, Spin } from 'antd';
import { HeatMapOutlined } from '@ant-design/icons';
import { Heatmap } from '@ant-design/charts';
import { useHeatmapChart } from '../../hooks';
import { AskAIButton } from '../AIAssistant/components/';
import './HeatmapChart.css';

interface HeatmapChartProps {
  timeRange?: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ timeRange }) => {
  const { data: heatmapData, loading: heatmapLoading } = useHeatmapChart(timeRange);

  // Prepare heatmap chart data
  const heatmapChartConfig = React.useMemo(() => {
    if (!heatmapData) return null;

    return {
      data: heatmapData.data,
      xField: 'hour',
      yField: 'day',
      colorField: 'value',
      color: ['#383e42', 'rgba(255,255,255,0.7)', '#fff'], // Using gray to white progression
      animation: {
        appear: {
          animation: 'fade-in',
          duration: 1000,
        },
      },
      tooltip: {
        formatter: (datum: any) => ({
          name: 'Usage Intensity',
          value: `${(datum.value * 100).toFixed(1)}% intensity at ${datum.hour}:00 on ${datum.day}`,
        }),
      },
      xAxis: {
        title: {
          text: 'Hour of Day',
        },
        label: {
          formatter: (text: string) => `${text}:00`,
        },
      },
      yAxis: {
        title: {
          text: 'Day of Week',
        },
      },
      legend: {
        position: 'bottom' as const,
      },
      meta: {
        value: {
          min: heatmapData.valueRange?.min || 0,
          max: heatmapData.valueRange?.max || 1,
        },
      },
    };
  }, [heatmapData]);

  return (
    <Card 
      className="heatmap-chart"
      title={
        <div className="heatmap-chart-header">
          <HeatMapOutlined className="heatmap-chart-icon" />
          Usage Patterns
        </div>
      }
      loading={heatmapLoading}
      extra={<AskAIButton context="Usage Patterns" question="What are my usage patterns throughout the week?" />}
    >
      {heatmapChartConfig ? (
        <div className="heatmap-chart-container">
          <Heatmap {...heatmapChartConfig} height={300} />
        </div>
      ) : (
        <div className="heatmap-chart-loading">
          <Spin size="large" />
        </div>
      )}
    </Card>
  );
};

export default HeatmapChart;
