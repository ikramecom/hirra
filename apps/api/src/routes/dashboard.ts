import { Router } from 'express';
import { computeDashboardStats } from '../services/stats.js';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', async (_req, res) => {
  try {
    const stats = await computeDashboardStats();
    res.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to compute stats';
    res.status(500).json({ error: message });
  }
});
