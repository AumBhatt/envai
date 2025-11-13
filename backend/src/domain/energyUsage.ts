import { ThermostatReading, EnergyBreakdown, DailyCost, WeeklyCost, HeatmapData } from './types.js';

// Constants
const ENERGY_RATE = 0.12; // $0.12 per kWh

/**
 * Calculate energy usage breakdown by mode
 * Uses: energyUsage, mode
 */
export const calculateEnergyBreakdown = (data: ThermostatReading[]): EnergyBreakdown => {
  const totalEnergy = data.reduce((sum, d) => sum + d.energyUsage, 0);
  
  const heating = data.filter(d => d.mode === 'heating')
    .reduce((sum, d) => sum + d.energyUsage, 0);
  
  const cooling = data.filter(d => d.mode === 'cooling')
    .reduce((sum, d) => sum + d.energyUsage, 0);
  
  const standby = data.filter(d => d.mode === 'off')
    .reduce((sum, d) => sum + d.energyUsage, 0);
  
  return {
    heating: Math.round((heating / totalEnergy) * 100),
    cooling: Math.round((cooling / totalEnergy) * 100),
    standby: Math.round((standby / totalEnergy) * 100),
    fan: 100 - Math.round(((heating + cooling + standby) / totalEnergy) * 100)
  };
};

/**
 * Calculate daily energy costs
 * Uses: energyUsage, timestamp
 */
export const calculateDailyCosts = (data: ThermostatReading[]): DailyCost[] => {
  const dailyData: { [key: string]: { totalEnergy: number; cost: number } } = {};
  
  data.forEach(reading => {
    const day = new Date(reading.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
    
    if (!dailyData[day]) {
      dailyData[day] = { totalEnergy: 0, cost: 0 };
    }
    
    dailyData[day].totalEnergy += reading.energyUsage;
    dailyData[day].cost = dailyData[day].totalEnergy * ENERGY_RATE;
  });
  
  return Object.entries(dailyData).map(([day, data]) => ({
    day,
    cost: Math.round(data.cost * 100) / 100
  }));
};

/**
 * Calculate weekly energy costs with projections
 * Uses: energyUsage, timestamp
 */
export const calculateWeeklyCosts = (data: ThermostatReading[]): WeeklyCost[] => {
  const weeklyData: { [key: string]: { totalEnergy: number; cost: number } } = {};
  
  data.forEach(reading => {
    const date = new Date(reading.timestamp);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { totalEnergy: 0, cost: 0 };
    }
    
    weeklyData[weekKey].totalEnergy += reading.energyUsage;
    weeklyData[weekKey].cost = weeklyData[weekKey].totalEnergy * ENERGY_RATE;
  });
  
  return Object.entries(weeklyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([week, data], index) => ({
      week: `Week ${index + 1}`,
      cost: Math.round(data.cost * 100) / 100,
      projected: null // Add projections for future weeks
    }));
};

/**
 * Create usage heatmap for calendar view
 * Uses: energyUsage, timestamp, occupancy
 */
export const createUsageHeatmap = (data: ThermostatReading[]): HeatmapData[] => {
  const heatmapData: HeatmapData[] = [];
  const maxEnergy = Math.max(...data.map(d => d.energyUsage));
  
  data.forEach(reading => {
    const date = new Date(reading.timestamp);
    const day = date.getDay(); // 0-6 (Sunday-Saturday)
    const hour = date.getHours(); // 0-23
    
    // Normalize energy usage to 0-1 scale for color intensity
    const intensity = reading.energyUsage / maxEnergy;
    
    heatmapData.push({
      day,
      hour,
      intensity: Math.round(intensity * 100) / 100,
      energyUsage: reading.energyUsage,
      occupancy: reading.occupancy
    });
  });
  
  return heatmapData;
};

/**
 * Calculate total daily energy usage
 * Uses: energyUsage
 */
export const calculateDailyEnergyUsage = (data: ThermostatReading[]): number => {
  return data.reduce((sum, reading) => sum + reading.energyUsage, 0);
};

/**
 * Calculate energy cost for given usage
 * Uses: energyUsage
 */
export const calculateEnergyCost = (energyUsage: number): number => {
  return Math.round(energyUsage * ENERGY_RATE * 100) / 100;
};
