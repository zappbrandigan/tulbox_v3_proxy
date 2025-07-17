import dotenv from 'dotenv';
dotenv.config();

import logger from '@/logging/logger.js';
import type { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error occurred:', err);

  logger.error(message, {
    status,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    stack: err.stack,
    headers: req.headers,
  });

  res.status(status).json({
    error: 'Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
