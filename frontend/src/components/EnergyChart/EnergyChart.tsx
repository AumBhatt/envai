import React from 'react';
import { Card, Spin } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { useEnergyChart } from '../../hooks';
import { AskAIButton } from '../AIAssistant/components/';
import './EnergyChart.css';

interface EnergyChartProps {
  timeRange?: string;
}

const EnergyChart: React.FC<EnergyChartProps> = ({ timeRange }) => {
  const { data: energyData, loading: energyLoading } = useEnergyChart(timeRange);

  // Prepare energy chart data
  const energyChartConfig = React.useMemo(() => {
    if (!energyData) return null;

    // Transform backend data format to chart format
    const chartData = energyData.labels.map((label: string, index: number) => ({
      day: label,
      cost: energyData.data[index],
    }));

    return {
      data: chartData,
      xField: 'day',
      yField: 'cost',
      color: '#fff', // Using white for chart elements
      columnWidthRatio: 0.8,
      animation: {
        appear: {
          animation: 'scale-in-y',
          duration: 1000,
        },
      },
      tooltip: {
        formatter: (datum: any) => ({
          name: 'Daily Cost',
          value: `$${datum.cost.toFixed(2)}`,
        }),
      },
      yAxis: {
        title: {
          text: `Daily Cost (${energyData.unit || '$'})`,
          style: { fill: '#fff' }
        },
        label: { style: { fill: '#fff' } },
        line: { style: { stroke: '#fff' } },
        tickLine: { style: { stroke: '#fff' } }
      },
      xAxis: {
        title: {
          text: 'Day',
          style: { fill: '#fff' }
        },
        label: { style: { fill: '#fff' } },
        line: { style: { stroke: '#fff' } },
        tickLine: { style: { stroke: '#fff' } }
      },
    };
  }, [energyData]);

  return (
    <Card 
      className="energy-chart"
      title={
        <div className="energy-chart-header">
          <BarChartOutlined className="energy-chart-icon" />
          Energy Usage
        </div>
      }
      loading={energyLoading}
      extra={<AskAIButton context="Energy Usage" question="How is my energy consumption?" />}
    >
      {energyChartConfig ? (
        <div className="energy-chart-container">
          <Column {...energyChartConfig} height={300} />
        </div>
      ) : (
        <div className="energy-chart-loading">
          <Spin size="large" />
        </div>
      )}
    </Card>
  );
};

export default EnergyChart;
