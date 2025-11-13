import { Router } from 'express';
import { AnalyticsHandler } from '../handlers/analyticsHandler.js';

const router = Router();

// GET /api/analytics/comparison - Comparison between two time periods
router.get('/comparison', AnalyticsHandler.getComparison);

// GET /api/analytics/health - System health analysis
router.get('/health', AnalyticsHandler.getSystemHealth);

export { router as analyticsRoutes };
