import { ThermostatReading, ComfortMetrics, KPIMetrics } from './types.js';
import { calculateEfficiencyScore, calculateTemperatureConsistency, calculateDailyAvgTemp } from './temperature.js';
import { calculateDailyEnergyUsage, calculateEnergyCost } from './energyUsage.js';

// Constants
const ENERGY_RATE = 0.12; // $0.12 per kWh

/**
 * Calculate comprehensive comfort metrics for radar chart
 * Uses: currentTemp, targetTemp, humidity, energyUsage, occupancy, mode
 */
export const calculateComfortMetrics = (data: ThermostatReading[]): ComfortMetrics => {
  // Temperature Consistency (0-100): How close actual temp stays to target
  const tempConsistency = calculateTemperatureConsistency(data);

  // Humidity Control (0-100): Optimal range is 40-60%
  const humidityControl = data.reduce((sum, d) => {
    const optimal = d.humidity >= 40 && d.humidity <= 60 ? 100 : 
                   Math.max(0, 100 - Math.abs(50 - d.humidity) * 2);
    return sum + optimal;
  }, 0) / data.length;

  // Energy Efficiency (0-100): Lower energy usage = higher score
  const maxEnergy = Math.max(...data.map(d => d.energyUsage));
  const energyEfficiency = data.reduce((sum, d) => {
    return sum + Math.max(0, 100 - (d.energyUsage / maxEnergy) * 100);
  }, 0) / data.length;

  // Cost Effectiveness (0-100): Based on energy costs
  const avgCost = data.reduce((sum, d) => sum + d.energyUsage, 0) * ENERGY_RATE / data.length;
  const costEffectiveness = Math.max(0, 100 - (avgCost * 10));

  // Overall Comfort (0-100): Weighted average
  const overallComfort = (tempConsistency * 0.3 + humidityControl * 0.2 + 
                         energyEfficiency * 0.3 + costEffectiveness * 0.2);

  return {
    tempConsistency: Math.round(tempConsistency),
    humidityControl: Math.round(humidityControl),
    energyEfficiency: Math.round(energyEfficiency),
    costEffectiveness: Math.round(costEffectiveness),
    overallComfort: Math.round(overallComfort)
  };
};

/**
 * Calculate KPI metrics for dashboard cards
 * Uses: currentTemp, targetTemp, humidity, energyUsage, mode, occupancy, outsideTemp
 */
export const calculateKPIMetrics = (data: ThermostatReading[]): KPIMetrics => {
  const latest = data[data.length - 1];
  const dailyData = data.slice(-24); // Last 24 hours
  
  const dailyEnergyUsage = calculateDailyEnergyUsage(dailyData);
  const dailyCost = calculateEnergyCost(dailyEnergyUsage);
  const efficiency = calculateEfficiencyScore(latest);
  const dailyAvgTemp = calculateDailyAvgTemp(dailyData);

  return {
    currentTemp: latest.currentTemp,
    dailyCost,
    efficiency,
    humidity: latest.humidity,
    outsideTemp: latest.outsideTemp,
    mode: latest.mode,
    occupancy: latest.occupancy,
    dailyAvgTemp
  };
};

/**
 * Calculate occupancy-based efficiency
 * Uses: occupancy, energyUsage, mode
 */
export const calculateOccupancyEfficiency = (data: ThermostatReading[]): number => {
  const occupiedReadings = data.filter(d => d.occupancy);
  const unoccupiedReadings = data.filter(d => !d.occupancy);
  
  const occupiedAvgEnergy = occupiedReadings.length > 0 
    ? occupiedReadings.reduce((sum, d) => sum + d.energyUsage, 0) / occupiedReadings.length
    : 0;
    
  const unoccupiedAvgEnergy = unoccupiedReadings.length > 0
    ? unoccupiedReadings.reduce((sum, d) => sum + d.energyUsage, 0) / unoccupiedReadings.length
    : 0;
  
  // Higher efficiency when unoccupied energy usage is significantly lower
  const efficiencyRatio = occupiedAvgEnergy > 0 
    ? (occupiedAvgEnergy - unoccupiedAvgEnergy) / occupiedAvgEnergy
    : 0;
    
  return Math.round(Math.max(0, Math.min(100, efficiencyRatio * 100)));
};

/**
 * Calculate mode distribution analytics
 * Uses: mode, timestamp
 */
export const calculateModeDistribution = (data: ThermostatReading[]) => {
  const modeCount = data.reduce((acc, reading) => {
    acc[reading.mode] = (acc[reading.mode] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  const total = data.length;
  
  return Object.entries(modeCount).map(([mode, count]) => ({
    mode,
    count,
    percentage: Math.round((count / total) * 100)
  }));
};

/**
 * Calculate weather impact on energy usage
 * Uses: outsideTemp, energyUsage, currentTemp, targetTemp
 */
export const calculateWeatherImpact = (data: ThermostatReading[]): number => {
  const weatherImpactScores = data.map(reading => {
    const outsideDiff = Math.abs(reading.outsideTemp - reading.targetTemp);
    const energyNormalized = reading.energyUsage / 5; // Normalize to 0-1 scale
    
    // Higher outside temperature difference should correlate with higher energy usage
    const expectedEnergyRatio = Math.min(1, outsideDiff / 20);
    const actualEnergyRatio = Math.min(1, energyNormalized);
    
    // Score based on how well energy usage matches weather conditions
    return Math.abs(expectedEnergyRatio - actualEnergyRatio);
  });
  
  const avgImpactScore = weatherImpactScores.reduce((sum, score) => sum + score, 0) / weatherImpactScores.length;
  
  // Convert to 0-100 scale (lower difference = higher score)
  return Math.round(Math.max(0, 100 - (avgImpactScore * 100)));
};

/**
 * Generate summary statistics
 * Uses: all fields
 */
export const generateSummaryStats = (data: ThermostatReading[]) => {
  const totalEnergy = calculateDailyEnergyUsage(data);
  const totalCost = calculateEnergyCost(totalEnergy);
  const avgTemp = calculateDailyAvgTemp(data);
  const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
  const occupancyRate = (data.filter(d => d.occupancy).length / data.length) * 100;
  
  return {
    totalEnergy: Math.round(totalEnergy * 100) / 100,
    totalCost,
    avgTemp,
    avgHumidity: Math.round(avgHumidity),
    occupancyRate: Math.round(occupancyRate),
    dataPoints: data.length,
    timeRange: {
      start: data[0]?.timestamp,
      end: data[data.length - 1]?.timestamp
    }
  };
};
