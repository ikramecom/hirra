import express from 'express';
import cors from 'cors';
import { requireAdmin } from './middleware/auth.js';
import { ordersRouter } from './routes/orders.js';
import { dashboardRouter } from './routes/dashboard.js';

export function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) ?? [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ];

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'riyanaluxe-api' });
  });

  app.use('/api', requireAdmin);
  app.use('/api/orders', ordersRouter);
  app.use('/api/dashboard', dashboardRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
