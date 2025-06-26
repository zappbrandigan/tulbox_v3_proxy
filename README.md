# TulBOX Proxy

An Express.js proxy server built with TypeScript and Vite that helps hide API keys from the TulBOX frontend application.

## API Endpoints

### Health Check
- `GET /health` - Server health status

### External Services
- `ALL /api/external/:service/*` - Proxy to external services

### Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - Comma-separated CORS origins