import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import type { RateLimitOptions } from '../types/index.js';
import { ErrorCodes, errorResponse } from '../types/index.js';

/**
 * Creates a rate limiter middleware with custom options per route
 * @param options - Custom rate limit options for this specific route
 */
export function createRateLimiter(options: RateLimitOptions = {}) {
  const {
    windowMs = env.RATE_LIMIT_WINDOW_MS,
    max = env.RATE_LIMIT_MAX_REQUESTS,
    message = 'Too many requests, please try again later.',
  } = options;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: errorResponse(ErrorCodes.RATE_LIMIT_EXCEEDED, message),
    keyGenerator: (req) => {
      // Use API key if available, otherwise use IP
      const apiKey = req.headers[env.API_KEY_HEADER.toLowerCase()] as string | undefined;
      return apiKey || req.ip || 'unknown';
    },
  });
}

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  strict: createRateLimiter({ windowMs: 60000, max: 10 }),
  standard: createRateLimiter({ windowMs: 60000, max: 60 }),
  relaxed: createRateLimiter({ windowMs: 60000, max: 200 }),
  burst: createRateLimiter({ windowMs: 10000, max: 100 }),
};
