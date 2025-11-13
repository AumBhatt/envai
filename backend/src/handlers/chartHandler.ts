import { Request, Response, NextFunction } from 'express';
import { chartDataService } from '../services/chartDataService.js';
import { dataService } from '../services/dataService.js';

export class ChartHandler {

  /**
   * GET /api/charts
   * Get all chart data at once
   */
  static async getAllCharts(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      
      // Validate and get data based on time range
      const data = ChartHandler.getDataByTimeRange(timeRange as string);
      const chartData = chartDataService.getAllChartsData(data);
      
      res.json({
        success: true,
        data: chartData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'charts',
          timeRange: timeRange || 'all',
          dataPoints: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/charts/temperature
   * Get temperature line chart data
   */
  static async getTemperatureChart(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      const data = ChartHandler.getDataByTimeRange(timeRange as string);
      const chartData = chartDataService.getTemperatureChartData(data);
      
      res.json({
        success: true,
        data: chartData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'charts/temperature',
          timeRange: timeRange || 'all',
          dataPoints: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/charts/gauge
   * Get efficiency gauge chart data
   */
  static async getGaugeChart(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      const data = ChartHandler.getDataByTimeRange(timeRange as string);
      const chartData = chartDataService.getGaugeChartData(data);
      
      res.json({
        success: true,
        data: chartData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'charts/gauge',
          timeRange: timeRange || 'all'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/charts/energy-breakdown
   * Get energy usage breakdown donut chart data
   */
  static async getEnergyBreakdownChart(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      const data = ChartHandler.getDataByTimeRange(timeRange as string);
      const chartData = chartDataService.getEnergyBreakdownChartData(data);
      
      res.json({
        success: true,
        data: chartData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'charts/energy-breakdown',
          timeRange: timeRange || 'all',
          dataPoints: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/charts/weekly-costs
   * Get weekly energy costs bar chart data
   */
  static async getWeeklyCostsChart(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      const data = ChartHandler.getDataByTimeRange(timeRange as string);
      const chartData = chartDataService.getWeeklyCostsChartData(data);
      
      res.json({
        success: true,
        data: chartData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'charts/weekly-costs',
          timeRange: timeRange || 'all',
          dataPoints: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/charts/heatmap
   * Get usage patterns heatmap data
   */
  static async getHeatmapChart(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      const data = ChartHandler.getDataByTimeRange(timeRange as string);
      const chartData = chartDataService.getHeatmapChartData(data);
      
      res.json({
        success: true,
        data: chartData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'charts/heatmap',
          timeRange: timeRange || 'all',
          dataPoints: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/charts/area
   * Get cost trends area chart data
   */
  static async getAreaChart(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      const data = ChartHandler.getDataByTimeRange(timeRange as string);
      const chartData = chartDataService.getAreaChartData(data);
      
      res.json({
        success: true,
        data: chartData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'charts/area',
          timeRange: timeRange || 'all',
          dataPoints: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/charts/radar
   * Get comfort metrics radar chart data
   */
  static async getRadarChart(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      const data = ChartHandler.getDataByTimeRange(timeRange as string);
      const chartData = chartDataService.getRadarChartData(data);
      
      res.json({
        success: true,
        data: chartData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'charts/radar',
          timeRange: timeRange || 'all',
          dataPoints: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/charts/kpi
   * Get KPI cards data
   */
  static async getKPIData(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      const data = ChartHandler.getDataByTimeRange(timeRange as string);
      const chartData = chartDataService.getKPIData(data);
      
      res.json({
        success: true,
        data: chartData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'charts/kpi',
          timeRange: timeRange || 'all',
          dataPoints: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Helper method to get data based on time range
   */
  private static getDataByTimeRange(timeRange?: string) {
    const validTimeRanges = ['24h', '7d', '30d'];
    
    if (!timeRange || !validTimeRanges.includes(timeRange)) {
      return dataService.loadThermostatData();
    }

    switch (timeRange) {
      case '24h':
        return dataService.getRecentData(24);
      case '7d':
        return dataService.getRecentData(168); // 7 days * 24 hours
      case '30d':
        return dataService.getRecentData(720); // 30 days * 24 hours
      default:
        return dataService.loadThermostatData();
    }
  }
}
