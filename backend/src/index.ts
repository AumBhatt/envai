import express from 'express';
import cors from 'cors';
import { dashboardRoutes } from './routes/dashboard.js';
import { chartRoutes } from './routes/charts.js';
import { dataRoutes } from './routes/data.js';
import { analyticsRoutes } from './routes/analytics.js';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Thermostat Dashboard API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Thermostat Dashboard API',
    version: '1.0.0',
    endpoints: {
      dashboard: '/api/dashboard',
      charts: '/api/charts',
      data: '/api/data',
      analytics: '/api/analytics',
      health: '/health'
    }
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Envai Backend running on port ${PORT}`);
});

export default app;
