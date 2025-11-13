import { Router } from 'express';
import { DashboardHandler } from '../handlers/dashboardHandler.js';

const router = Router();

// GET /api/dashboard - Complete dashboard data
router.get('/', DashboardHandler.getDashboard);

// GET /api/dashboard/summary - Dashboard summary with key metrics
router.get('/summary', DashboardHandler.getDashboardSummary);

// GET /api/dashboard/health - System health overview
router.get('/health', DashboardHandler.getSystemHealth);

// GET /api/dashboard/filtered - Filtered dashboard data
router.get('/filtered', DashboardHandler.getFilteredDashboard);

// GET /api/dashboard/comparison - Comparison between time periods
router.get('/comparison', DashboardHandler.getComparison);

export { router as dashboardRoutes };
