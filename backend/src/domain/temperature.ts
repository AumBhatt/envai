import { ThermostatReading } from './types.js';

/**
 * Get temperature trend data for line chart
 * Uses: currentTemp, targetTemp, outsideTemp, timestamp
 */
export const getTemperatureTrends = (data: ThermostatReading[]) => {
  return {
    hours: data.map(d => new Date(d.timestamp).getHours()),
    currentTemps: data.map(d => d.currentTemp),
    targetTemps: data.map(d => d.targetTemp),
    outsideTemps: data.map(d => d.outsideTemp)
  };
};

/**
 * Calculate efficiency score based on temperature management
 * Uses: currentTemp, targetTemp, outsideTemp, energyUsage
 */
export const calculateEfficiencyScore = (reading: ThermostatReading): number => {
  const tempDiff = Math.abs(reading.currentTemp - reading.targetTemp);
  const outsideDiff = Math.abs(reading.currentTemp - reading.outsideTemp);
  
  // Base efficiency: closer to target = better
  const tempEfficiency = Math.max(0, 100 - (tempDiff * 20));
  
  // Energy efficiency: less energy for same temp difference = better
  const energyEfficiency = reading.energyUsage > 0 
    ? Math.max(0, 100 - (reading.energyUsage * 10))
    : 100;
  
  // Weather factor: working against bigger outside difference is harder
  const weatherFactor = outsideDiff > 10 ? 0.8 : 1.0;
  
  return Math.round((tempEfficiency + energyEfficiency) / 2 * weatherFactor);
};

/**
 * Calculate temperature consistency score
 * Uses: currentTemp, targetTemp
 */
export const calculateTemperatureConsistency = (data: ThermostatReading[]): number => {
  const consistency = data.reduce((sum, d) => {
    const diff = Math.abs(d.currentTemp - d.targetTemp);
    return sum + Math.max(0, 100 - (diff * 25));
  }, 0) / data.length;

  return Math.round(consistency);
};

/**
 * Calculate daily average temperature
 * Uses: currentTemp
 */
export const calculateDailyAvgTemp = (data: ThermostatReading[]): number => {
  const avgTemp = data.reduce((sum, d) => sum + d.currentTemp, 0) / data.length;
  return Math.round(avgTemp * 10) / 10;
};

/**
 * Get current temperature reading
 * Uses: currentTemp, targetTemp, outsideTemp
 */
export const getCurrentTemperatureReading = (data: ThermostatReading[]) => {
  const latest = data[data.length - 1];
  return {
    current: latest.currentTemp,
    target: latest.targetTemp,
    outside: latest.outsideTemp
  };
};

/**
 * Calculate temperature variance over time
 * Uses: currentTemp
 */
export const calculateTemperatureVariance = (data: ThermostatReading[]): number => {
  const temps = data.map(d => d.currentTemp);
  const mean = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
  const variance = temps.reduce((sum, temp) => sum + Math.pow(temp - mean, 2), 0) / temps.length;
  return Math.round(variance * 100) / 100;
};

/**
 * Find temperature extremes
 * Uses: currentTemp, timestamp
 */
export const findTemperatureExtremes = (data: ThermostatReading[]) => {
  const temps = data.map(d => ({ temp: d.currentTemp, timestamp: d.timestamp }));
  const minTemp = temps.reduce((min, current) => current.temp < min.temp ? current : min);
  const maxTemp = temps.reduce((max, current) => current.temp > max.temp ? current : max);
  
  return {
    min: minTemp,
    max: maxTemp
  };
};
