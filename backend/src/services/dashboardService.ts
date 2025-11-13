import { ThermostatReading } from '../domain/types.js';
import { dataService } from './dataService.js';
import { chartDataService } from './chartDataService.js';
import { generateSummaryStats } from '../domain/analytics.js';

export class DashboardService {

  /**
   * Get complete dashboard data with all charts and metrics
   */
  getDashboardData(timeRange?: string) {
    let data: ThermostatReading[];
    
    // Get data based on time range
    switch (timeRange) {
      case '24h':
        data = dataService.getRecentData(24);
        break;
      case '7d':
        data = dataService.getRecentData(168); // 7 days * 24 hours
        break;
      case '30d':
        data = dataService.getRecentData(720); // 30 days * 24 hours
        break;
      default:
        data = dataService.loadThermostatData();
    }

    const allCharts = chartDataService.getAllChartsData(data);
    const summary = generateSummaryStats(data);

    return {
      summary,
      charts: allCharts,
      metadata: {
        timeRange: timeRange || 'all',
        dataPoints: data.length,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  /**
   * Get dashboard summary with key metrics only
   */
  getDashboardSummary() {
    const data = dataService.loadThermostatData();
    const kpiData = chartDataService.getKPIData(data);
    const summary = generateSummaryStats(data);
    const latest = dataService.getLatestReading();

    return {
      currentStatus: {
        temperature: latest.currentTemp,
        targetTemp: latest.targetTemp,
        mode: latest.mode,
        occupancy: latest.occupancy,
        timestamp: latest.timestamp
      },
      kpis: kpiData,
      summary: {
        totalEnergy: summary.totalEnergy,
        totalCost: summary.totalCost,
        avgTemp: summary.avgTemp,
        occupancyRate: summary.occupancyRate
      },
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get specific chart data by type
   */
  getChartData(chartType: string, timeRange?: string) {
    let data: ThermostatReading[];
    
    switch (timeRange) {
      case '24h':
        data = dataService.getRecentData(24);
        break;
      case '7d':
        data = dataService.getRecentData(168);
        break;
      case '30d':
        data = dataService.getRecentData(720);
        break;
      default:
        data = dataService.loadThermostatData();
    }

    switch (chartType) {
      case 'temperature':
        return chartDataService.getTemperatureChartData(data);
      case 'gauge':
        return chartDataService.getGaugeChartData(data);
      case 'energy-breakdown':
        return chartDataService.getEnergyBreakdownChartData(data);
      case 'weekly-costs':
        return chartDataService.getWeeklyCostsChartData(data);
      case 'heatmap':
        return chartDataService.getHeatmapChartData(data);
      case 'area':
        return chartDataService.getAreaChartData(data);
      case 'radar':
        return chartDataService.getRadarChartData(data);
      case 'kpi':
        return chartDataService.getKPIData(data);
      default:
        throw new Error(`Unknown chart type: ${chartType}`);
    }
  }

  /**
   * Get filtered dashboard data
   */
  getFilteredDashboardData(filters: {
    mode?: string;
    occupancy?: boolean;
    dateRange?: { start: string; end: string };
    minTemp?: number;
    maxTemp?: number;
  }) {
    let data: ThermostatReading[];

    if (filters.dateRange) {
      data = dataService.getDateRangeData(filters.dateRange.start, filters.dateRange.end);
    } else {
      data = dataService.loadThermostatData();
    }

    // Apply additional filters
    const filteredData = dataService.filterData(data, {
      mode: filters.mode,
      occupancy: filters.occupancy,
      minTemp: filters.minTemp,
      maxTemp: filters.maxTemp
    });

    const allCharts = chartDataService.getAllChartsData(filteredData);
    const summary = generateSummaryStats(filteredData);

    return {
      summary,
      charts: allCharts,
      filters: filters,
      metadata: {
        originalDataPoints: data.length,
        filteredDataPoints: filteredData.length,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  /**
   * Get comparison data between two time periods
   */
  getComparisonData(period1: { start: string; end: string }, period2: { start: string; end: string }) {
    const data1 = dataService.getDateRangeData(period1.start, period1.end);
    const data2 = dataService.getDateRangeData(period2.start, period2.end);

    const summary1 = generateSummaryStats(data1);
    const summary2 = generateSummaryStats(data2);
    const kpi1 = chartDataService.getKPIData(data1);
    const kpi2 = chartDataService.getKPIData(data2);

    return {
      period1: {
        dateRange: period1,
        summary: summary1,
        kpis: kpi1
      },
      period2: {
        dateRange: period2,
        summary: summary2,
        kpis: kpi2
      },
      comparison: {
        energyChange: ((summary2.totalEnergy - summary1.totalEnergy) / summary1.totalEnergy * 100).toFixed(1),
        costChange: ((summary2.totalCost - summary1.totalCost) / summary1.totalCost * 100).toFixed(1),
        tempChange: (summary2.avgTemp - summary1.avgTemp).toFixed(1),
        efficiencyChange: (kpi2.efficiency.value - kpi1.efficiency.value).toFixed(1)
      }
    };
  }

  /**
   * Get system health overview
   */
  getSystemHealth() {
    const data = dataService.getRecentData(24); // Last 24 hours
    const latest = dataService.getLatestReading();
    const kpis = chartDataService.getKPIData(data);

    // Calculate health scores
    const tempHealth = Math.abs(latest.currentTemp - latest.targetTemp) < 2 ? 'good' : 'warning';
    const energyHealth = kpis.efficiency.level;
    const humidityHealth = kpis.humidity.optimal ? 'good' : 'warning';

    return {
      overall: tempHealth === 'good' && energyHealth === 'good' && humidityHealth === 'good' ? 'healthy' : 'needs_attention',
      components: {
        temperature: {
          status: tempHealth,
          current: latest.currentTemp,
          target: latest.targetTemp,
          difference: Math.abs(latest.currentTemp - latest.targetTemp)
        },
        energy: {
          status: energyHealth,
          efficiency: kpis.efficiency.value,
          dailyCost: kpis.dailyCost.value
        },
        humidity: {
          status: humidityHealth,
          current: latest.humidity,
          optimal: kpis.humidity.optimal
        },
        system: {
          mode: latest.mode,
          occupancy: latest.occupancy,
          lastReading: latest.timestamp
        }
      },
      recommendations: this.generateHealthRecommendations(tempHealth, energyHealth, humidityHealth, latest)
    };
  }

  /**
   * Generate health-based recommendations
   */
  private generateHealthRecommendations(tempHealth: string, energyHealth: string, humidityHealth: string, latest: ThermostatReading) {
    const recommendations: string[] = [];

    if (tempHealth === 'warning') {
      const diff = latest.currentTemp - latest.targetTemp;
      if (diff > 2) {
        recommendations.push('Current temperature is significantly above target. Consider adjusting thermostat or checking for heat sources.');
      } else if (diff < -2) {
        recommendations.push('Current temperature is significantly below target. System may need maintenance or insulation check.');
      }
    }

    if (energyHealth === 'poor') {
      recommendations.push('Energy efficiency is low. Consider scheduling maintenance or adjusting temperature settings.');
    }

    if (humidityHealth === 'warning') {
      if (latest.humidity < 40) {
        recommendations.push('Humidity is too low. Consider using a humidifier.');
      } else if (latest.humidity > 60) {
        recommendations.push('Humidity is too high. Consider using a dehumidifier or improving ventilation.');
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('System is operating optimally. No immediate actions needed.');
    }

    return recommendations;
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
