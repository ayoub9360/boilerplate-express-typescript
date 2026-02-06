import pino from 'pino';

// Simple logger - JSON output in all environments
// Use pino-pretty externally in dev: pnpm dev | pnpm pino-pretty
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
});

export type Logger = typeof logger;
