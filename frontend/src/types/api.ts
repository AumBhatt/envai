// API Response Types for Thermostat Dashboard

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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  metadata: {
    timestamp: string;
    endpoint: string;
    [key: string]: any;
  };
}

export interface ApiError {
  success: false;
  message: string;
  timestamp: string;
}

// Dashboard Types
export interface DashboardSummary {
  totalEnergy: number;
  totalCost: number;
  avgTemp: number;
  avgHumidity: number;
  occupancyRate: number;
  dataPoints: number;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface ChartDataset {
  label: string;
  data: number[];
}

export interface TemperatureChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface EnergyChartData {
  labels: string[];
  data: number[];
  unit: string;
}

export interface HeatmapDataPoint {
  day: number;
  hour: number;
  value: number;
  energyUsage: number;
  occupancy: boolean;
}

export interface HeatmapChartData {
  data: HeatmapDataPoint[];
  xAxisLabels: string[];
  yAxisLabels: string[];
  valueRange: {
    min: number;
    max: number;
  };
}

export interface RadarChartData {
  labels: string[];
  data: number[];
  scale: {
    min: number;
    max: number;
  };
}

export interface GaugeChartData {
  value: number;
  min: number;
  max: number;
  title: string;
  unit: string;
}

export interface EnergyBreakdownChartData {
  labels: string[];
  data: number[];
}

export interface KPIData {
  currentTemp: {
    title: string;
    value: number;
    unit: string;
    target: number;
    comparison: string;
  };
  dailyCost: {
    title: string;
    value: number;
    unit: string;
    description: string;
  };
  efficiency: {
    title: string;
    value: number;
    unit: string;
    description: string;
    level: string;
  };
  humidity: {
    title: string;
    value: number;
    unit: string;
    description: string;
    optimal: boolean;
  };
  outsideTemp: {
    title: string;
    value: number;
    unit: string;
    description: string;
  };
  systemMode: {
    title: string;
    value: string;
    occupancy: boolean;
    description: string;
  };
}

export interface DashboardCharts {
  temperatureChart: TemperatureChartData;
  energyChart: EnergyChartData;
  heatmapChart: HeatmapChartData;
  areaChart: EnergyChartData;
  radarChart: RadarChartData;
  kpiData: KPIData;
}

export interface DashboardData {
  summary: DashboardSummary;
  charts: DashboardCharts;
  metadata: {
    timeRange: string;
    dataPoints: number;
    lastUpdated: string;
  };
}

// Analytics Types
export interface SystemHealthComponent {
  status: 'good' | 'warning' | 'error' | 'fair';
  [key: string]: any;
}

export interface SystemHealthData {
  overall: 'good' | 'warning' | 'error' | 'needs_attention';
  components: {
    temperature: SystemHealthComponent;
    energy: SystemHealthComponent;
    humidity: SystemHealthComponent;
    system: SystemHealthComponent;
  };
  recommendations: string[];
}

export interface ComparisonData {
  period1: {
    start: string;
    end: string;
    summary: DashboardSummary;
  };
  period2: {
    start: string;
    end: string;
    summary: DashboardSummary;
  };
  comparison: {
    energyChange: number;
    costChange: number;
    tempChange: number;
    efficiencyChange: number;
  };
}

// Data Stats Types
export interface DataStats {
  totalReadings: number;
  dateRange: {
    start: string;
    end: string;
  };
  modes: string[];
  avgReadingsPerDay: number;
}

// Health Check Types
export interface HealthCheckData {
  success: boolean;
  message: string;
  timestamp: string;
}

// API Info Types
export interface ApiInfoData {
  success: boolean;
  message: string;
  version: string;
  endpoints: {
    dashboard: string;
    charts: string;
    data: string;
    analytics: string;
    health: string;
  };
}

// Hook Return Types
export interface UseApiHookReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
