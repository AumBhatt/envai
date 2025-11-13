export interface ThermostatReading {
  timestamp: string;
  currentTemp: number;
  targetTemp: number;
  humidity: number;
  energyUsage: number;
  mode: string;
  occupancy: boolean;
  outsideTemp: number;
}

export interface EnergyBreakdown {
  heating: number;
  cooling: number;
  standby: number;
  fan: number;
}

export interface DailyCost {
  day: string;
  cost: number;
}

export interface WeeklyCost {
  week: string;
  cost: number;
  projected: number | null;
}

export interface HeatmapData {
  day: number;
  hour: number;
  intensity: number;
  energyUsage: number;
  occupancy: boolean;
}

export interface ComfortMetrics {
  tempConsistency: number;
  humidityControl: number;
  energyEfficiency: number;
  costEffectiveness: number;
  overallComfort: number;
}

export interface KPIMetrics {
  currentTemp: number;
  dailyCost: number;
  efficiency: number;
  humidity: number;
  outsideTemp: number;
  mode: string;
  occupancy: boolean;
  dailyAvgTemp: number;
}
