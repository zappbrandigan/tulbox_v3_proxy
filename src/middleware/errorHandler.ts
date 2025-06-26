import type { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: 'Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
  next();
};