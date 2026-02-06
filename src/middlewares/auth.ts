import { eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { db } from '../db/index.js';
import { apiKeys } from '../db/schema/index.js';
import { ApiError, ErrorCodes } from '../types/index.js';

// Extend Request type to include apiKey info
declare global {
  namespace Express {
    interface Request {
      apiKey?: {
        id: number;
        name: string;
      };
    }
  }
}

/**
 * Middleware to validate API key from request headers against the database
 */
export async function apiKeyAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKeyHeader = req.headers[env.API_KEY_HEADER.toLowerCase()] as string | undefined;

    if (!apiKeyHeader) {
      throw new ApiError(
        401,
        ErrorCodes.AUTHENTICATION_ERROR,
        `Missing API key. Please provide it in the '${env.API_KEY_HEADER}' header.`
      );
    }

    // Find the API key in the database
    const [foundKey] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.key, apiKeyHeader))
      .limit(1);

    if (!foundKey) {
      throw new ApiError(401, ErrorCodes.AUTHENTICATION_ERROR, 'Invalid API key.');
    }

    if (!foundKey.isActive) {
      throw new ApiError(401, ErrorCodes.AUTHENTICATION_ERROR, 'API key is inactive.');
    }

    // Update last used timestamp and request count
    await db
      .update(apiKeys)
      .set({
        lastUsedAt: new Date(),
        requestCount: foundKey.requestCount + 1,
      })
      .where(eq(apiKeys.id, foundKey.id));

    // Attach API key info to request for later use
    req.apiKey = {
      id: foundKey.id,
      name: foundKey.name,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional auth - continues even without API key but sets flag
 */
export async function optionalApiKeyAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKeyHeader = req.headers[env.API_KEY_HEADER.toLowerCase()] as string | undefined;

    if (apiKeyHeader) {
      const [foundKey] = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.key, apiKeyHeader))
        .limit(1);

      if (foundKey?.isActive) {
        req.apiKey = {
          id: foundKey.id,
          name: foundKey.name,
        };
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
