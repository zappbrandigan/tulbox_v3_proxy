import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './logging/logger.js';
import { proxyRouter } from './routes/proxy.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logRouter } from './routes/log.js';
import type { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Deployment logging
app.use(morgan('common'));

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// For extra logging info
app.use((_req, res, next) => {
  res.setHeader('Accept-CH', 'Sec-CH-UA-Platform');
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Front-end event logging
app.use('/log', logRouter);

// API routes
app.use('/api', proxyRouter);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  const msg = {
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
  };

  logger.warn('Invalide route', {
    path: req.originalUrl,
    method: req.method,
    ...msg,
  });
  res.status(404).json(msg);
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  const message = `Proxy server running on port ${PORT}`;
  logger.info(message);
  console.log(message);
  console.log(`Health check: /health`);
  console.log(`API endpoints: /api/*`);
});

export default app;
