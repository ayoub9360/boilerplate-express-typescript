import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Middleware factory to validate request body, query, and params using Zod schemas
 * @param schemas - Object containing Zod schemas for body, query, and/or params
 */
export function validate(schemas: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) req.body = await schemas.body.parseAsync(req.body);
      if (schemas.query) req.query = await schemas.query.parseAsync(req.query);
      if (schemas.params) req.params = await schemas.params.parseAsync(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Validate only request body
 */
export function validateBody<T extends ZodSchema>(schema: T) {
  return validate({ body: schema });
}

/**
 * Validate only query parameters
 */
export function validateQuery<T extends ZodSchema>(schema: T) {
  return validate({ query: schema });
}

/**
 * Validate only URL parameters
 */
export function validateParams<T extends ZodSchema>(schema: T) {
  return validate({ params: schema });
}
