import { Router } from 'express';
import { ChartHandler } from '../handlers/chartHandler.js';

const router = Router();

// GET /api/charts - All chart data at once
router.get('/', ChartHandler.getAllCharts);

// GET /api/charts/temperature - Temperature line chart data
router.get('/temperature', ChartHandler.getTemperatureChart);

// GET /api/charts/gauge - Efficiency gauge chart data
router.get('/gauge', ChartHandler.getGaugeChart);

// GET /api/charts/energy-breakdown - Energy usage breakdown donut chart
router.get('/energy-breakdown', ChartHandler.getEnergyBreakdownChart);

// GET /api/charts/weekly-costs - Weekly energy costs bar chart
router.get('/weekly-costs', ChartHandler.getWeeklyCostsChart);

// GET /api/charts/heatmap - Usage patterns heatmap
router.get('/heatmap', ChartHandler.getHeatmapChart);

// GET /api/charts/area - Cost trends area chart
router.get('/area', ChartHandler.getAreaChart);

// GET /api/charts/radar - Comfort metrics radar chart
router.get('/radar', ChartHandler.getRadarChart);

// GET /api/charts/kpi - KPI cards data
router.get('/kpi', ChartHandler.getKPIData);

export { router as chartRoutes };
