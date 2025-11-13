import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ThermostatReading } from '../domain/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DataService {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'store/db.json');
  }

  /**
   * Load all thermostat data from JSON file
   */
  loadThermostatData(): ThermostatReading[] {
    try {
      const rawData = fs.readFileSync(this.dataPath, 'utf8');
      const data = JSON.parse(rawData) as ThermostatReading[];
      return this.validateData(data);
    } catch (error) {
      console.error('Error loading thermostat data:', error);
      throw new Error('Failed to load thermostat data');
    }
  }

  /**
   * Validate data structure and types
   */
  private validateData(data: any[]): ThermostatReading[] {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }

    return data.filter(reading => {
      return (
        typeof reading.timestamp === 'string' &&
        typeof reading.currentTemp === 'number' &&
        typeof reading.targetTemp === 'number' &&
        typeof reading.humidity === 'number' &&
        typeof reading.energyUsage === 'number' &&
        typeof reading.mode === 'string' &&
        typeof reading.occupancy === 'boolean' &&
        typeof reading.outsideTemp === 'number'
      );
    });
  }

  /**
   * Get recent data by hours
   */
  getRecentData(hours: number = 24): ThermostatReading[] {
    const allData = this.loadThermostatData();
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    return allData.filter(reading => {
      const readingTime = new Date(reading.timestamp);
      return readingTime >= cutoffTime;
    });
  }

  /**
   * Get data for specific date range
   */
  getDateRangeData(startDate: string, endDate: string): ThermostatReading[] {
    const allData = this.loadThermostatData();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return allData.filter(reading => {
      const readingTime = new Date(reading.timestamp);
      return readingTime >= start && readingTime <= end;
    });
  }

  /**
   * Filter data by criteria
   */
  filterData(data: ThermostatReading[], filters: {
    mode?: string;
    occupancy?: boolean;
    minTemp?: number;
    maxTemp?: number;
    minEnergy?: number;
    maxEnergy?: number;
  }): ThermostatReading[] {
    return data.filter(reading => {
      if (filters.mode && reading.mode !== filters.mode) return false;
      if (filters.occupancy !== undefined && reading.occupancy !== filters.occupancy) return false;
      if (filters.minTemp && reading.currentTemp < filters.minTemp) return false;
      if (filters.maxTemp && reading.currentTemp > filters.maxTemp) return false;
      if (filters.minEnergy && reading.energyUsage < filters.minEnergy) return false;
      if (filters.maxEnergy && reading.energyUsage > filters.maxEnergy) return false;
      return true;
    });
  }

  /**
   * Get latest reading
   */
  getLatestReading(): ThermostatReading {
    const data = this.loadThermostatData();
    if (data.length === 0) {
      throw new Error('No data available');
    }
    return data[data.length - 1];
  }

  /**
   * Get data grouped by day
   */
  getDataGroupedByDay(): { [key: string]: ThermostatReading[] } {
    const data = this.loadThermostatData();
    const grouped: { [key: string]: ThermostatReading[] } = {};

    data.forEach(reading => {
      const day = new Date(reading.timestamp).toISOString().split('T')[0];
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(reading);
    });

    return grouped;
  }

  /**
   * Get data grouped by hour of day (0-23)
   */
  getDataGroupedByHour(): { [key: number]: ThermostatReading[] } {
    const data = this.loadThermostatData();
    const grouped: { [key: number]: ThermostatReading[] } = {};

    data.forEach(reading => {
      const hour = new Date(reading.timestamp).getHours();
      if (!grouped[hour]) {
        grouped[hour] = [];
      }
      grouped[hour].push(reading);
    });

    return grouped;
  }

  /**
   * Get data statistics
   */
  getDataStats(): {
    totalReadings: number;
    dateRange: { start: string; end: string };
    modes: string[];
    avgReadingsPerDay: number;
  } {
    const data = this.loadThermostatData();
    
    if (data.length === 0) {
      throw new Error('No data available for statistics');
    }

    const modes = [...new Set(data.map(d => d.mode))];
    const dates = data.map(d => new Date(d.timestamp));
    const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      totalReadings: data.length,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      modes,
      avgReadingsPerDay: Math.round(data.length / daysDiff)
    };
  }
}

// Export singleton instance
export const dataService = new DataService();
