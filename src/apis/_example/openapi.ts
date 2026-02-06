import { registry, z } from '../../config/openapi.js';
import { metadata } from './route.js';

// Schema for hello query params
const HelloQuerySchema = z.object({
  name: z.string().optional().openapi({ example: 'World', description: 'Name to greet' }),
});

// Schema for hello response
const HelloResponseSchema = z.object({
  message: z.string().openapi({ example: 'Hello, World!' }),
  timestamp: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
});

// Schema for echo input
const EchoInputSchema = z.object({
  message: z
    .string()
    .min(1)
    .max(1000)
    .openapi({ example: 'Hello', description: 'Message to echo' }),
  repeat: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .default(1)
    .openapi({ example: 3, description: 'Number of times to repeat' }),
});

// Schema for echo response
const EchoResponseSchema = z.object({
  original: z.string().openapi({ example: 'Hello' }),
  echoed: z.string().openapi({ example: 'Hello Hello Hello' }),
  repeat: z.number().openapi({ example: 3 }),
});

// Schema for info response
const InfoResponseSchema = z.object({
  api: z.string().openapi({ example: 'example' }),
  version: z.string().openapi({ example: 'v1' }),
  description: z.string(),
  endpoints: z.array(
    z.object({
      method: z.string(),
      path: z.string(),
      description: z.string(),
    })
  ),
});

// Register GET /hello
registry.registerPath({
  method: 'get',
  path: `${metadata.basePath}/hello`,
  tags: [metadata.name],
  summary: 'Returns a hello message',
  request: {
    query: HelloQuerySchema,
  },
  responses: {
    200: {
      description: 'Hello message',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: HelloResponseSchema,
          }),
        },
      },
    },
  },
});

// Register POST /echo
registry.registerPath({
  method: 'post',
  path: `${metadata.basePath}/echo`,
  tags: [metadata.name],
  summary: 'Echoes back the input message',
  security: [{ ApiKeyAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: EchoInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Echoed message',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: EchoResponseSchema,
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(false),
            error: z.object({
              code: z.string(),
              message: z.string(),
              details: z.unknown().optional(),
            }),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized - Invalid or missing API key',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(false),
            error: z.object({
              code: z.string(),
              message: z.string(),
            }),
          }),
        },
      },
    },
  },
});

// Register GET /info
registry.registerPath({
  method: 'get',
  path: `${metadata.basePath}/info`,
  tags: [metadata.name],
  summary: 'Returns API information',
  responses: {
    200: {
      description: 'API information',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: InfoResponseSchema,
          }),
        },
      },
    },
  },
});
