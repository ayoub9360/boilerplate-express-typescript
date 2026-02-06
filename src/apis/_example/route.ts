import { Router, type Router as RouterType } from 'express';
import { z } from 'zod';
import { exampleController } from './controller.js';
import { apiKeyAuth, rateLimiters, validateBody } from '../../middlewares/index.js';
import type { ApiMetadata } from '../../types/index.js';

// API Metadata
export const metadata: ApiMetadata = {
  name: 'Example API',
  version: 'v1',
  description: 'Example API to demonstrate the project structure',
  basePath: '/api/example/v1',
};

// Validation schemas
export const exampleInputSchema = z.object({
  message: z.string().min(1).max(1000),
  repeat: z.number().int().min(1).max(10).optional().default(1),
});

export type ExampleInput = z.infer<typeof exampleInputSchema>;

// Router
const router: RouterType = Router();

router.get('/hello', rateLimiters.standard, exampleController.hello);

router.post(
  '/echo',
  apiKeyAuth,
  rateLimiters.strict,
  validateBody(exampleInputSchema),
  exampleController.echo
);

router.get('/info', exampleController.info);

export default router;
