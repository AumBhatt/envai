import { Request, Response, NextFunction } from 'express';
import { dataService } from '../services/dataService.js';

export class DataHandler {

  /**
   * GET /api/data
   * Get all thermostat data with optional filtering
   */
  static async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      const { mode, occupancy, minTemp, maxTemp, minEnergy, maxEnergy } = req.query;
      
      let data = dataService.loadThermostatData();
      
      // Apply filters if provided
      if (mode || occupancy !== undefined || minTemp || maxTemp || minEnergy || maxEnergy) {
        const filters: any = {};
        
        if (mode) filters.mode = mode as string;
        if (occupancy !== undefined) filters.occupancy = occupancy === 'true';
        if (minTemp) filters.minTemp = parseFloat(minTemp as string);
        if (maxTemp) filters.maxTemp = parseFloat(maxTemp as string);
        if (minEnergy) filters.minEnergy = parseFloat(minEnergy as string);
        if (maxEnergy) filters.maxEnergy = parseFloat(maxEnergy as string);
        
        data = dataService.filterData(data, filters);
      }
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'data',
          totalRecords: data.length,
          filters: req.query
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/latest
   * Get the latest thermostat reading
   */
  static async getLatestReading(req: Request, res: Response, next: NextFunction) {
    try {
      const data = dataService.getLatestReading();
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'data/latest'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/stats
   * Get data statistics and overview
   */
  static async getDataStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = dataService.getDataStats();
      
      res.json({
        success: true,
        data: stats,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'data/stats'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/recent
   * Get recent data by hours
   */
  static async getRecentData(req: Request, res: Response, next: NextFunction) {
    try {
      const { hours } = req.query;
      
      // Validate hours parameter
      const hoursNum = hours ? parseInt(hours as string) : 24;
      if (isNaN(hoursNum) || hoursNum <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid hours parameter. Must be a positive number.',
          metadata: {
            timestamp: new Date().toISOString(),
            endpoint: 'data/recent'
          }
        });
      }
      
      const data = dataService.getRecentData(hoursNum);
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'data/recent',
          hours: hoursNum,
          totalRecords: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/range
   * Get data for a specific date range
   */
  static async getDateRangeData(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      
      // Validate required parameters
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: startDate and endDate',
          metadata: {
            timestamp: new Date().toISOString(),
            endpoint: 'data/range'
          }
        });
      }
      
      // Validate date format
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)',
          metadata: {
            timestamp: new Date().toISOString(),
            endpoint: 'data/range'
          }
        });
      }
      
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'startDate must be before endDate',
          metadata: {
            timestamp: new Date().toISOString(),
            endpoint: 'data/range'
          }
        });
      }
      
      const data = dataService.getDateRangeData(startDate as string, endDate as string);
      
      res.json({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'data/range',
          dateRange: {
            start: startDate,
            end: endDate
          },
          totalRecords: data.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/grouped/day
   * Get data grouped by day
   */
  static async getDataGroupedByDay(req: Request, res: Response, next: NextFunction) {
    try {
      const groupedData = dataService.getDataGroupedByDay();
      
      res.json({
        success: true,
        data: groupedData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'data/grouped/day',
          totalDays: Object.keys(groupedData).length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/grouped/hour
   * Get data grouped by hour of day (0-23)
   */
  static async getDataGroupedByHour(req: Request, res: Response, next: NextFunction) {
    try {
      const groupedData = dataService.getDataGroupedByHour();
      
      res.json({
        success: true,
        data: groupedData,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint: 'data/grouped/hour',
          totalHours: Object.keys(groupedData).length
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
