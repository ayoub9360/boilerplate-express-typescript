import type { Request, Response } from 'express';
import { successResponse } from '../../types/index.js';
import type { ExampleInput } from './route.js';

/**
 * Example controller - demonstrates the pattern for all APIs
 */
export const exampleController = {
  /**
   * GET /api/example/v1/hello
   * Returns a hello message
   */
  async hello(req: Request, res: Response): Promise<void> {
    const name = (req.query.name as string) || 'World';

    res.json(
      successResponse({
        message: `Hello, ${name}!`,
        timestamp: new Date().toISOString(),
      })
    );
  },

  /**
   * POST /api/example/v1/echo
   * Echoes back the input message
   */
  async echo(req: Request<unknown, unknown, ExampleInput>, res: Response): Promise<void> {
    const { message, repeat = 1 } = req.body;

    const echoed = Array(repeat).fill(message).join(' ');

    res.json(
      successResponse({
        original: message,
        echoed,
        repeat,
      })
    );
  },

  /**
   * GET /api/example/v1/info
   * Returns API information
   */
  async info(_req: Request, res: Response): Promise<void> {
    res.json(
      successResponse({
        api: 'example',
        version: 'v1',
        description: 'Example API to demonstrate the project structure',
        endpoints: [
          { method: 'GET', path: '/hello', description: 'Returns a hello message' },
          { method: 'POST', path: '/echo', description: 'Echoes back the input message' },
          { method: 'GET', path: '/info', description: 'Returns API information' },
        ],
      })
    );
  },
};
