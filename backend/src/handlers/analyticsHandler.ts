import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService.js';

export class AnalyticsHandler {

  /**
   * GET /api/analytics/comparison
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
            endpoint: 'analytics/comparison'
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
          endpoint: 'analytics/comparison',
          periods: { period1, period2 }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/health
   * Get system health analysis
   */
  static async getSystemHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const data = dashboardService.getSystemHealth();
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'analytics/health'
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
