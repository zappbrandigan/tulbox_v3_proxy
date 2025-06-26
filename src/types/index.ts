export interface ProxyConfig {
  baseUrl: string;
  apiKey: string;
  headers: object;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  stack?: string;
}