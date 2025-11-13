import { ThermostatReading } from '../domain/types.js';
import { 
  calculateEnergyBreakdown, 
  calculateDailyCosts, 
  calculateWeeklyCosts, 
  createUsageHeatmap 
} from '../domain/energyUsage.js';
import { 
  getTemperatureTrends, 
  calculateEfficiencyScore 
} from '../domain/temperature.js';
import { 
  calculateComfortMetrics, 
  calculateKPIMetrics 
} from '../domain/analytics.js';

export class ChartDataService {
  
  /**
   * Get data for line chart - Temperature Trends Over Time
   * Uses: currentTemp, targetTemp, outsideTemp, timestamp
   */
  getTemperatureChartData(data: ThermostatReading[]) {
    const trends = getTemperatureTrends(data);
    
    return {
      labels: trends.hours.map(hour => `${hour.toString().padStart(2, '0')}:00`),
      datasets: [
        {
          label: 'Current Temperature',
          data: trends.currentTemps
        },
        {
          label: 'Target Temperature',
          data: trends.targetTemps
        },
        {
          label: 'Outside Temperature',
          data: trends.outsideTemps
        }
      ]
    };
  }

  /**
   * Get data for gauge chart - Current Efficiency Score
   * Uses: currentTemp, targetTemp, outsideTemp, energyUsage
   */
  getGaugeChartData(data: ThermostatReading[]) {
    const latest = data[data.length - 1];
    const efficiency = calculateEfficiencyScore(latest);
    
    return {
      value: efficiency,
      min: 0,
      max: 100,
      title: 'System Efficiency',
      unit: '%'
    };
  }

  /**
   * Get data for donut chart - Energy Usage Breakdown
   * Uses: energyUsage, mode
   */
  getEnergyBreakdownChartData(data: ThermostatReading[]) {
    const breakdown = calculateEnergyBreakdown(data);
    
    return {
      labels: ['Heating', 'Cooling', 'Standby', 'Fan'],
      data: [breakdown.heating, breakdown.cooling, breakdown.standby, breakdown.fan]
    };
  }

  /**
   * Get data for bar chart - Weekly Energy Costs
   * Uses: energyUsage, timestamp
   */
  getWeeklyCostsChartData(data: ThermostatReading[]) {
    const costs = calculateDailyCosts(data);
    
    return {
      labels: costs.map(c => c.day),
      data: costs.map(c => c.cost),
      unit: '$'
    };
  }

  /**
   * Get data for heatmap calendar - Usage Patterns
   * Uses: energyUsage, timestamp, occupancy
   */
  getHeatmapChartData(data: ThermostatReading[]) {
    const heatmapData = createUsageHeatmap(data);
    
    return {
      data: heatmapData.map(point => ({
        day: point.day,
        hour: point.hour,
        value: point.intensity,
        energyUsage: point.energyUsage,
        occupancy: point.occupancy
      })),
      xAxisLabels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
      yAxisLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      valueRange: { min: 0, max: 1 }
    };
  }

  /**
   * Get data for area chart - Monthly Cost Trends
   * Uses: energyUsage, timestamp
   */
  getAreaChartData(data: ThermostatReading[]) {
    const weeklyCosts = calculateWeeklyCosts(data);
    
    return {
      labels: weeklyCosts.map(w => w.week),
      data: weeklyCosts.map(w => w.cost),
      unit: '$'
    };
  }

  /**
   * Get data for radar chart - Home Comfort Metrics
   * Uses: currentTemp, targetTemp, humidity, energyUsage, occupancy, mode
   */
  getRadarChartData(data: ThermostatReading[]) {
    const metrics = calculateComfortMetrics(data);
    
    return {
      labels: [
        'Temperature Consistency',
        'Humidity Control',
        'Energy Efficiency',
        'Cost Effectiveness',
        'Overall Comfort'
      ],
      data: [
        metrics.tempConsistency,
        metrics.humidityControl,
        metrics.energyEfficiency,
        metrics.costEffectiveness,
        metrics.overallComfort
      ],
      scale: { min: 0, max: 100 }
    };
  }

  /**
   * Get data for KPI cards - Key Metrics
   * Uses: currentTemp, targetTemp, humidity, energyUsage, mode, occupancy, outsideTemp
   */
  getKPIData(data: ThermostatReading[]) {
    const kpis = calculateKPIMetrics(data);
    const latest = data[data.length - 1];
    
    return {
      currentTemp: {
        title: 'Current Temperature',
        value: kpis.currentTemp,
        unit: '°F',
        target: latest.targetTemp,
        comparison: kpis.currentTemp > kpis.dailyAvgTemp ? 'above_average' : 'below_average'
      },
      dailyCost: {
        title: 'Daily Cost',
        value: kpis.dailyCost,
        unit: '$',
        description: 'Energy usage cost'
      },
      efficiency: {
        title: 'Efficiency Score',
        value: kpis.efficiency,
        unit: '%',
        description: 'System performance',
        level: kpis.efficiency > 70 ? 'good' : kpis.efficiency > 40 ? 'fair' : 'poor'
      },
      humidity: {
        title: 'Humidity',
        value: kpis.humidity,
        unit: '%',
        description: 'Current humidity level',
        optimal: kpis.humidity >= 40 && kpis.humidity <= 60
      },
      outsideTemp: {
        title: 'Outside Temperature',
        value: kpis.outsideTemp,
        unit: '°F',
        description: 'Weather conditions'
      },
      systemMode: {
        title: 'System Mode',
        value: kpis.mode,
        occupancy: kpis.occupancy,
        description: kpis.occupancy ? 'Occupied' : 'Unoccupied'
      }
    };
  }

  /**
   * Get all chart data at once
   */
  getAllChartsData(data: ThermostatReading[]) {
    return {
      temperatureChart: this.getTemperatureChartData(data),
      gaugeChart: this.getGaugeChartData(data),
      energyBreakdownChart: this.getEnergyBreakdownChartData(data),
      weeklyCostsChart: this.getWeeklyCostsChartData(data),
      heatmapChart: this.getHeatmapChartData(data),
      areaChart: this.getAreaChartData(data),
      radarChart: this.getRadarChartData(data),
      kpiData: this.getKPIData(data)
    };
  }
}

// Export singleton instance
export const chartDataService = new ChartDataService();
