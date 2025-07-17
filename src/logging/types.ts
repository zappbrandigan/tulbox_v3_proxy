export const SOURCES = {
  PROXY: 'proxy-server',
  FRONTEND: 'frontend',
  RAW_VIEWER: 'raw-viewer',
  PDF_TOOL: 'pdf-manager',
  IMDB: 'imdb-search',
  CWR: 'cwr-converter',
  UNKNOWN: 'unknown',
} as const;

export type LogSource = (typeof SOURCES)[keyof typeof SOURCES];

// Event type categories (strictly typed)
export const TYPES = {
  USER_EVENT: 'user-event',
  PROXY_ERROR: 'proxy-error',
  ROUTE_ACCESS: 'route-access',
  INTERNAL_ERROR: 'internal-error',
} as const;

export type LogType = (typeof TYPES)[keyof typeof TYPES];

export const USER_EVENT = {
  LINK_CLICK: 'link-click',
  UI_INTERACTION: 'ui-interaction',
  REPORT_VIEW: 'report-view',
  TOOL_OPEN: 'tool-open',
  FILE_UPLOAD: 'file-upload',
  FILE_DOWNLOAD: 'file-download',
} as const;

export const USER_EVENT_TARGETS = {
  DOCS_LINK: 'docs-link',
  SUPPORT_LINK: 'support-link',
  THEME_TOGGLE: 'theme-toggle',
  RAW_VIEWER: 'raw-viewer',
  PDF_MANAGER: 'pdf-manager',
  CWR_CONVERTER: 'cwr-converter',
} as const;

type ValueOf<T> = T[keyof T];

export type UserEventAction = ValueOf<typeof USER_EVENT>;
export type UserEventTarget = ValueOf<typeof USER_EVENT_TARGETS>;

export interface LogContext {
  source?: LogSource;
  type?: LogType;
  event?: {
    action: UserEventAction;
    target: UserEventTarget;
    value?: string | number | boolean;
  };
  userId?: string;
  sessionId?: string;
  feature?: string;
  ip?: string;
  path?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export interface LogPayload extends LogContext {
  message: string;
  level: 'info' | 'warn' | 'error';
  logKey: string;
}
