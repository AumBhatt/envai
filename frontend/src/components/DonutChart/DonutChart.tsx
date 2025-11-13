import React from 'react';
import { Card, Spin } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/charts';
import { useEnergyBreakdownChart } from '../../hooks';
import { AskAIButton } from '../AIAssistant/components/';
import './DonutChart.css';

interface DonutChartProps {
  timeRange?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ timeRange }) => {
  const { data: breakdownData, loading: breakdownLoading } = useEnergyBreakdownChart(timeRange);

  // Prepare donut chart data
  const donutChartConfig = React.useMemo(() => {
    if (!breakdownData || !breakdownData.labels || !breakdownData.data) return null;

    // Transform backend data format to chart format
    const chartData = breakdownData.labels.map((label: string, index: number) => ({
      type: label,
      value: breakdownData.data[index] || 0,
    })).filter(item => item.value > 0); // Only show non-zero values

    if (chartData.length === 0) return null;

    return {
      data: chartData,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      innerRadius: 0.6,
      color: ['#fff', '#383e42', 'rgba(255,255,255,0.7)', 'rgba(56,62,66,0.7)'], // Using white and gray variations
      label: {
        type: 'outer',
        content: (data: any) => `${data.type}: ${data.percent}%`,
      },
      legend: {
        position: 'bottom' as const,
      },
      interactions: [
        {
          type: 'element-active',
        },
      ],
      animation: {
        appear: {
          animation: 'grow-in-xy',
          duration: 1000,
        },
      },
      tooltip: {
        formatter: (datum: any) => ({
          name: datum.type,
          value: `${datum.value} kWh`,
        }),
      },
    };
  }, [breakdownData]);

  return (
    <Card 
      className="donut-chart"
      title={
        <div className="donut-chart-header">
          <PieChartOutlined className="donut-chart-icon" />
          Energy Breakdown
        </div>
      }
      loading={breakdownLoading}
      extra={<AskAIButton context="Energy Breakdown" question="What's my energy breakdown by category?" />}
    >
      {donutChartConfig ? (
        <div className="donut-chart-container">
          <Pie {...donutChartConfig} height={300} />
        </div>
      ) : (
        <div className="donut-chart-loading">
          <Spin size="large" />
        </div>
      )}
    </Card>
  );
};

export default DonutChart;
