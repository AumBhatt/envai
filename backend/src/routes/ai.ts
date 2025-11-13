import express from 'express';
import { ragService } from '../services/ragService.js';

const router = express.Router();

/**
 * POST /api/ai/query
 * Natural language query with RAG
 */
router.post('/query', async (req, res) => {
  try {
    const { prompt, timeRange = '7d' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt is required and must be a string'
      });
    }

    if (prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt cannot be empty'
      });
    }

    // Execute RAG query
    const answer = await ragService.queryWithRAG(prompt, timeRange);

    res.json({
      answer,
      timeRange,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process AI query'
    });
  }
});

/**
 * GET /api/ai/health
 * Check AI service health
 */
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await ragService.healthCheck();
    
    res.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      ollama: isHealthy,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI health check error:', error);
    res.status(500).json({
      status: 'error',
      ollama: false,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
