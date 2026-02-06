import { integer, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// API Keys table - for tracking API key usage
export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
  requestCount: integer('request_count').default(0).notNull(),
  isActive: integer('is_active').default(1).notNull(),
});

// API Usage logs - for tracking API usage
export const apiUsageLogs = pgTable('api_usage_logs', {
  id: serial('id').primaryKey(),
  requestId: uuid('request_id').defaultRandom().notNull(),
  apiName: varchar('api_name', { length: 100 }).notNull(),
  apiVersion: varchar('api_version', { length: 10 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  path: text('path').notNull(),
  statusCode: integer('status_code'),
  responseTimeMs: integer('response_time_ms'),
  apiKeyId: integer('api_key_id').references(() => apiKeys.id),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types inferred from schema
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type ApiUsageLog = typeof apiUsageLogs.$inferSelect;
export type NewApiUsageLog = typeof apiUsageLogs.$inferInsert;
