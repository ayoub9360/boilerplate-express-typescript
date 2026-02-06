import type { NextFunction, Request, Response } from 'express';

// Standard API Response types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    requestId?: string;
    timestamp?: string;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error codes
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// Custom Error class
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: ErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Rate limiter options per route
export interface RateLimitOptions {
  windowMs?: number;
  max?: number;
  message?: string;
}

// Validation schema type helper
export type ValidatedRequest<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
> = Request<TParams, unknown, TBody, TQuery>;

// Express handler types
export type AsyncHandler<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
> = (
  req: ValidatedRequest<TBody, TQuery, TParams>,
  res: Response,
  next: NextFunction
) => Promise<void>;

// API Route metadata for documentation
export interface ApiMetadata {
  name: string;
  version: string;
  description: string;
  basePath: string;
}

// Helper to create success response
export function successResponse<T>(data: T, meta?: ApiSuccessResponse['meta']): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

// Helper to create error response
export function errorResponse(
  code: ErrorCode,
  message: string,
  details?: unknown
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}
