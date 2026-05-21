import type { RequestHandler } from 'express';

const adminKey = process.env.ADMIN_API_KEY;

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }

  if (!adminKey) {
    res.status(503).json({ error: 'ADMIN_API_KEY is not configured on the server' });
    return;
  }

  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : req.headers['x-admin-key'];

  if (typeof token !== 'string' || token !== adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};
