# Small API

Collection of utility APIs - HTML to PDF, QR Code Generator, Favicon Grabber, and more.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- A [Neon](https://neon.tech) PostgreSQL database

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your Neon DATABASE_URL
# Get it from https://console.neon.tech

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

The API will be available at `http://localhost:4000`

## 📚 Documentation

- **Swagger UI**: http://localhost:3000/docs
- **OpenAPI JSON**: http://localhost:3000/docs.json

## 🏗️ Project Structure

```
src/
├── apis/                  # API modules
│   └── _example/          # Example API (template)
│       ├── controller.ts  # Business logic
│       └── route.ts       # Route definitions & validation
├── config/
│   ├── env.ts             # Environment variables (Zod validated)
│   └── swagger.ts         # Swagger configuration
├── db/
│   ├── schema/            # Drizzle ORM schemas
│   └── index.ts           # Database connection
├── middlewares/
│   ├── auth.ts            # API key authentication
│   ├── errorHandler.ts    # Error handling
│   ├── rateLimiter.ts     # Rate limiting (per-route)
│   └── validate.ts        # Zod validation middleware
├── types/
│   └── index.ts           # Shared TypeScript types
├── utils/
│   └── logger.ts          # Pino logger
├── app.ts                 # Express app setup
└── server.ts              # Server entry point
```

## 📝 Creating a New API

1. Create a new folder in `src/apis/` (e.g., `html-to-pdf`)
2. Create `controller.ts` with your business logic
3. Create `route.ts` with routes, validation schemas, and Swagger docs
4. Register the routes in `src/app.ts`

Example structure:
```typescript
// src/apis/html-to-pdf/route.ts
export const metadata: ApiMetadata = {
  name: 'HTML to PDF',
  version: 'v1',
  description: 'Convert HTML to PDF',
  basePath: '/api/html-to-pdf/v1',
};
```

## 🔒 Authentication

API uses API key authentication via the `x-api-key` header.

```bash
curl -H "x-api-key: your-api-key" http://localhost:3000/api/example/v1/echo
```

## ⚡ Rate Limiting

Rate limits are configurable per route:

```typescript
import { rateLimiters, createRateLimiter } from '@/middlewares';

// Pre-configured limiters
router.get('/endpoint', rateLimiters.strict, controller.method);  // 10 req/min
router.get('/endpoint', rateLimiters.standard, controller.method); // 60 req/min
router.get('/endpoint', rateLimiters.relaxed, controller.method);  // 200 req/min

// Custom limiter
router.get('/endpoint', createRateLimiter({ windowMs: 60000, max: 30 }), controller.method);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

## 🐳 Docker

```bash
# Build and run (requires DATABASE_URL in .env)
docker-compose up -d

# Build only
docker-compose build

# View logs
docker-compose logs -f api
```

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check code with Biome |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code |
| `npm test` | Run tests in watch mode |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Logging**: Pino
- **Testing**: Vitest
- **Linting**: Biome

## 📄 License

MIT
