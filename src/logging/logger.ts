import dotenv from 'dotenv';
dotenv.config();

import { Logtail } from '@logtail/node';
import type { LogContext } from './types';

const logtail = new Logtail(process.env.LOGTAIL_KEY!, {
  endpoint: process.env.LOGTAIL_ENDPOINT,
});

const withTags = (
  fn: typeof logtail.info | typeof logtail.warn | typeof logtail.error
) => {
  return (message: string, context: LogContext = {}) => {
    return fn.call(logtail, message, {
      env: process.env.NODE_ENV || 'development',
      source: context.source ?? 'proxy-server',
      type: context.type ?? 'route-access',
      ...context,
    } as LogContext);
  };
};

export default {
  info: withTags(logtail.info),
  warn: withTags(logtail.warn),
  error: withTags(logtail.error),
  raw: logtail,
};
