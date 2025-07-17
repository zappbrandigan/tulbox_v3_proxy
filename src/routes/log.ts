import express from 'express';
import logger from '@/logging/logger.js';
import { SOURCES, TYPES, type LogContext } from '@/logging/types.js';

const router = express.Router();

router.post('/', express.text({ type: '*/*' }), async (req, res) => {
  let body: any;

  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (err) {
    logger.warn('Malformed log payload', {
      raw: req.body,
      error: (err as Error).message,
      source: SOURCES.UNKNOWN,
    });
    return res.status(204).end();
  }

  const {
    logKey,
    message,
    level = 'info',
    data = {},
    source = SOURCES.FRONTEND,
    type = TYPES.USER_EVENT,
  } = body ?? {};

  if (logKey !== process.env.LOGGING_SECRET) {
    logger.warn('Unauthorized frontend log attempt', {
      source,
      path: req.headers.referer || 'unknown',
      ip: req.ip,
    });
    return res.status(204).end();
  }

  if (!message) {
    logger.warn('Log payload missing message', { body, source });
    return res.status(204).end();
  }

  const context = {
    ...data,
    event: body.event,
    source,
    type,
    path: req.headers.referer || 'unknown',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  } as LogContext;

  switch (level) {
    case 'error':
      logger.error(message, context);
      break;
    case 'warn':
      logger.warn(message, context);
      break;
    default:
      logger.info(message, context);
  }

  res.status(204).end();
});

export { router as logRouter };
