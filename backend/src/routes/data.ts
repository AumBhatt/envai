import { Router } from 'express';
import { DataHandler } from '../handlers/dataHandler.js';

const router = Router();

// GET /api/data - All thermostat data with optional filtering
router.get('/', DataHandler.getAllData);

// GET /api/data/latest - Latest thermostat reading
router.get('/latest', DataHandler.getLatestReading);

// GET /api/data/stats - Data statistics and overview
router.get('/stats', DataHandler.getDataStats);

// GET /api/data/recent - Recent data by hours
router.get('/recent', DataHandler.getRecentData);

// GET /api/data/range - Data for specific date range
router.get('/range', DataHandler.getDateRangeData);

// GET /api/data/grouped/day - Data grouped by day
router.get('/grouped/day', DataHandler.getDataGroupedByDay);

// GET /api/data/grouped/hour - Data grouped by hour of day
router.get('/grouped/hour', DataHandler.getDataGroupedByHour);

export { router as dataRoutes };
