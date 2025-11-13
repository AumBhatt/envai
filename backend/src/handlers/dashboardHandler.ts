import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService.js';

export class DashboardHandler {
  
  /**
   * GET /api/dashboard
   * Get complete dashboard data with all charts and metrics
   */
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeRange } = req.query;
      
      // Validate timeRange parameter
      const validTimeRanges = ['24h', '7d', '30d', 'all'];
      const selectedTimeRange = timeRange && validTimeRanges.includes(timeRange as string) 
        ? timeRange as string 
        : undefined;

      const data = dashboardService.getDashboardData(selectedTimeRange);
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'dashboard',
          timeRange: selectedTimeRange || 'all'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/summary
   * Get dashboard summary with key metrics only
   */
  static async getDashboardSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const data = dashboardService.getDashboardSummary();
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'dashboard/summary'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/health
   * Get system health overview
   */
  static async getSystemHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const data = dashboardService.getSystemHealth();
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'dashboard/health'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/filtered
   * Get filtered dashboard data
   */
  static async getFilteredDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { mode, occupancy, startDate, endDate, minTemp, maxTemp } = req.query;
      
      // Build filters object
      const filters: any = {};
      
      if (mode) filters.mode = mode as string;
      if (occupancy !== undefined) filters.occupancy = occupancy === 'true';
      if (startDate && endDate) {
        filters.dateRange = { 
          start: startDate as string, 
          end: endDate as string 
        };
      }
      if (minTemp) filters.minTemp = parseFloat(minTemp as string);
      if (maxTemp) filters.maxTemp = parseFloat(maxTemp as string);

      const data = dashboardService.getFilteredDashboardData(filters);
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'dashboard/filtered',
          appliedFilters: filters
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/comparison
   * Get comparison data between two time periods
   */
  static async getComparison(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
        period1Start, period1End, 
        period2Start, period2End 
      } = req.query;

      // Validate required parameters
      if (!period1Start || !period1End || !period2Start || !period2End) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: period1Start, period1End, period2Start, period2End',
          metadata: {
            timestamp: new Date().toISOString(),
            endpoint: 'dashboard/comparison'
          }
        });
      }

      const period1 = {
        start: period1Start as string,
        end: period1End as string
      };

      const period2 = {
        start: period2Start as string,
        end: period2End as string
      };

      const data = dashboardService.getComparisonData(period1, period2);
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'dashboard/comparison',
          periods: { period1, period2 }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
