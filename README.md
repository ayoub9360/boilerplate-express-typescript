# 🚀 Express TypeScript API Boilerplate

A production-ready, scalable Express.js API boilerplate with TypeScript, featuring authentication, rate limiting, validation, and auto-generated OpenAPI documentation.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-orange.svg)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **TypeScript** - Full type safety with strict mode
- **Express.js** - Fast, minimalist web framework
- **Drizzle ORM** - Type-safe database operations with PostgreSQL
- **Zod** - Runtime validation with TypeScript inference
- **OpenAPI/Swagger** - Auto-generated docs from Zod schemas
- **API Key Auth** - Database-backed authentication with usage tracking
- **Rate Limiting** - Configurable per-route rate limits
- **Pino Logger** - Fast, structured JSON logging
- **Docker Ready** - Multi-stage Dockerfile for dev & production
- **Biome** - Fast linting and formatting
- **Vitest** - Modern testing framework

## 📁 Project Structure

```
src/
├── apis/                    # API modules (one folder per API)
│   ├── general/             # Health, info, docs endpoints
│   │   ├── controller.ts
│   │   └── route.ts
│   └── _example/            # Example API (template)
│       ├── controller.ts
│       ├── route.ts
│       └── openapi.ts       # OpenAPI documentation
├── config/
│   ├── env.ts               # Environment variables (Zod validated)
│   ├── openapi.ts           # OpenAPI registry & schemas
│   └── swagger.ts           # Swagger UI setup
├── db/
│   ├── schema/              # Drizzle ORM schemas
│   ├── migrations/          # Generated migrations
│   └── index.ts             # Database connection
├── middlewares/
│   ├── auth.ts              # API key authentication
│   ├── errorHandler.ts      # Centralized error handling
│   ├── rateLimiter.ts       # Rate limiting (per-route)
│   └── validate.ts          # Zod validation middleware
├── types/
│   └── index.ts             # Shared TypeScript types
├── utils/
│   └── logger.ts            # Pino logger configuration
├── app.ts                   # Express app setup
└── server.ts                # Server entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm (recommended) or npm
- PostgreSQL database (we recommend [Neon](https://neon.tech))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/express-ts-boilerplate.git
cd express-ts-boilerplate

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL=postgresql://...

# Push schema to database
pnpm db:push

# Start development server
pnpm dev
```

The API will be available at `http://localhost:4000`

## 📚 API Documentation

- **Swagger UI**: http://localhost:4000/docs
- **OpenAPI JSON**: http://localhost:4000/docs.json
- **Health Check**: http://localhost:4000/health

## 🔒 Authentication

API keys are stored in the database with automatic usage tracking.

### Create an API Key

```sql
INSERT INTO api_keys (key, name) 
VALUES ('sk_live_your_secret_key', 'My App');
```

### Use the API Key

```bash
curl -H "x-api-key: sk_live_your_secret_key" \
     http://localhost:4000/api/example/v1/echo \
     -X POST -H "Content-Type: application/json" \
     -d '{"message": "Hello!"}'
```

### What's Tracked

| Field | Description |
|-------|-------------|
| `lastUsedAt` | Last usage timestamp |
| `requestCount` | Total requests made |
| `isActive` | Enable/disable without deleting |

## ⚡ Rate Limiting

Configure rate limits per route:

```typescript
import { rateLimiters, createRateLimiter } from '@/middlewares';

// Pre-configured limiters
router.get('/strict', rateLimiters.strict, handler);     // 10 req/min
router.get('/standard', rateLimiters.standard, handler); // 60 req/min
router.get('/relaxed', rateLimiters.relaxed, handler);   // 200 req/min

// Custom limiter
router.get('/custom', createRateLimiter({ 
  windowMs: 60000, 
  max: 30 
}), handler);
```

## 📝 Creating a New API

1. Create a folder in `src/apis/` (e.g., `my-api`)

2. Create the files:

```typescript
// src/apis/my-api/route.ts
import { Router, type Router as RouterType } from 'express';
import { z } from 'zod';
import { myController } from './controller.js';
import { validateBody, rateLimiters } from '../../middlewares/index.js';
import type { ApiMetadata } from '../../types/index.js';

export const metadata: ApiMetadata = {
  name: 'My API',
  version: 'v1',
  description: 'Description of my API',
  basePath: '/api/my-api/v1',
};

const inputSchema = z.object({
  field: z.string().min(1),
});

const router: RouterType = Router();

router.post('/', rateLimiters.standard, validateBody(inputSchema), myController.handle);

export default router;
```

3. Register in `src/app.ts`:

```typescript
import myApiRoutes, { metadata as myApiMetadata } from './apis/my-api/route.js';

app.use(myApiMetadata.basePath, myApiRoutes);
```

4. Add OpenAPI docs in `src/apis/my-api/openapi.ts` and import in `src/config/swagger.ts`

## 🐳 Docker

### Production

```bash
docker compose up --build
```

### Development (with hot reload)

```bash
BUILD_TARGET=development DEV_VOLUMES=./src docker compose up --build
```

Or create a `.env.dev` file:

```bash
BUILD_TARGET=development
DEV_VOLUMES=./src
NODE_ENV=development
LOG_LEVEL=debug
```

Then:

```bash
docker compose --env-file .env.dev up --build
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Lint and fix with Biome |
| `pnpm format` | Format code with Biome |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio |

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `4000` |
| `HOST` | Server host | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `API_KEY_HEADER` | Header name for API key | `x-api-key` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `LOG_LEVEL` | Pino log level | `info` |

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Language | TypeScript 5.7 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod |
| Documentation | OpenAPI 3.0 / Swagger UI |
| Logging | Pino |
| Testing | Vitest + Supertest |
| Linting | Biome |
| Container | Docker |

## 📄 License

MIT © [Ayoub El Guendouz](https://github.com/yourusername)

---

<p align="center">
  <sub>Built with ❤️ for developers who want to ship fast</sub>
</p>
