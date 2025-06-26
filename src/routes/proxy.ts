import express from 'express';
import axios from 'axios';
import type { Request, Response } from 'express';
import type { ProxyConfig } from '@/types';

const router = express.Router();

// Example proxy route for any external API
router.all('/external/:service/:path(*)', async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const path = req.params[0];
    
    // Map services to their base URLs and API keys
    const serviceConfig: Record<string, ProxyConfig> = {
      langDetect: {
        baseUrl: `https://${process.env.LANG_DETECT_HOST}`,
        headers: {
          'Content-Type': 'application/json'
        },
        apiKey: 'None'
      },
      imdbMain: {
        baseUrl: `https://${process.env.IMDB_HOST_MAIN}`,
        headers: {
          'x-rapidapi-key': process.env.API_KEY,
          'x-rapidapi-host': process.env.IMDB_HOST_MAIN
        },
        apiKey: process.env.API_KEY ?? ''
      },
      imdbDetails: {
        baseUrl: `https://${process.env.IMDB_HOST_DETAILS}`,
        headers: {
          'x-rapidapi-key': process.env.API_KEY,
          'x-rapidapi-host': process.env.IMDB_HOST_DETAILS
        },
        apiKey: process.env.API_KEY ?? ''
      },

    };
    const config = serviceConfig[service as keyof typeof serviceConfig];
    
    if (!config) {
      return res.status(400).json({
        error: 'Unsupported service',
        message: `Service '${service}' is not configured`,
      });
    }

    if (!config.apiKey) {
      return res.status(500).json({
        error: 'API key not configured',
        message: `API key for ${service} is missing from environment variables`,
      });
    }

    const response = await axios({
      method: req.method as any,
      url: `${config.baseUrl}/${path}`,
      headers: config.headers,
      data: req.body,
      params: req.query,
      timeout: 30000,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('External API proxy error:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data || { error: 'External API error' };
      res.status(status).json(message);
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  }
});

export { router as proxyRouter };