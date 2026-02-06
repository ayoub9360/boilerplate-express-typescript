import type { Request, Response } from 'express';
import { env } from '../../config/env.js';
import { swaggerSpec } from '../../config/swagger.js';

export const generalController = {
  health(_req: Request, res: Response): void {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
    });
  },

  info(_req: Request, res: Response): void {
    res.json({
      name: 'Small API',
      version: '1.0.0',
      documentation: '/docs',
    });
  },

  docsJson(_req: Request, res: Response): void {
    res.json(swaggerSpec);
  },
};
