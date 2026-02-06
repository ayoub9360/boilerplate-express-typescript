import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError, ErrorCodes, errorResponse } from '../types/index.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({
    err,
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
  });

  if (err instanceof ZodError) {
    res.status(400).json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed', {
        issues: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      })
    );
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json(errorResponse(err.code, err.message, err.details));
    return;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json(
    errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      isProduction ? 'An unexpected error occurred' : err.message,
      isProduction ? undefined : { stack: err.stack }
    )
  );
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(
    errorResponse(ErrorCodes.NOT_FOUND, `Route ${req.method} ${req.path} not found`)
  );
}
