import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import type { OpenAPIObject } from 'openapi3-ts/oas30';
import { z } from 'zod';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

// Create the OpenAPI registry
export const registry = new OpenAPIRegistry();

// Register security scheme
registry.registerComponent('securitySchemes', 'ApiKeyAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'x-api-key',
  description: 'API key for authentication',
});

// Common response schemas
export const ErrorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: z.string().openapi({ example: 'VALIDATION_ERROR' }),
      message: z.string().openapi({ example: 'Invalid request body' }),
      details: z.unknown().optional(),
    }),
  })
  .openapi('ErrorResponse');

export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z
    .object({
      success: z.literal(true),
      data: dataSchema,
      meta: z
        .object({
          timestamp: z.string().datetime().optional(),
        })
        .optional(),
    })
    .openapi('SuccessResponse');

// Register common schemas
registry.register('ErrorResponse', ErrorResponseSchema);

// Helper to generate OpenAPI document
export function generateOpenAPIDocument(): OpenAPIObject {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Small API',
      version: '1.0.0',
      description:
        'Collection of utility APIs - HTML to PDF, QR Code Generator, Favicon Grabber, and more',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
  });
}

// Re-export extended z for use in other files
export { z };
