import type { Request } from 'express';

export const getHeaderString = (
  value: string | string[] | undefined
): string | undefined => {
  return Array.isArray(value) ? value.join(', ') : value;
};

export const getUserEnv = (req: Request) => ({
  sessionId: getHeaderString(req.headers['x-session-id']) ?? '',
  platform: getHeaderString(req.headers['sec-ch-ua-platform']) ?? 'unknown',
  userAgent: getHeaderString(req.headers['user-agent']) ?? 'unknown',
  language: getHeaderString(req.headers['accept-language']) ?? 'unknown',
  doNotTrack: getHeaderString(req.headers['dnt']) ?? 'unspecified',
  cookiesEnabled: typeof req.headers['cookie'] === 'string',
});
