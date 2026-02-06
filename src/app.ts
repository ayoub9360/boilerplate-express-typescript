import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { errorHandler, notFoundHandler } from './middlewares/index.js';
import { logger } from './utils/logger.js';

import exampleRoutes, { metadata as exampleMetadata } from './apis/_example/route.js';
// Import API routes
import generalRoutes from './apis/general/route.js';

const isDev = process.env.NODE_ENV === 'development';

// Create Express app
const app: Express = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === '/health',
    },
    // Minimal logs in development
    serializers: isDev
      ? {
          req: (req) => ({
            method: req.method,
            url: req.url,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        }
      : undefined,
    // Custom log message
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
    customErrorMessage: (req, res) => {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
  })
);

// General routes (health, info, docs)
app.use(generalRoutes);

// API Routes
app.use(exampleMetadata.basePath, exampleRoutes);
// Add more API routes here:
// app.use(htmlToPdfMetadata.basePath, htmlToPdfRoutes);
// app.use(qrCodeMetadata.basePath, qrCodeRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
