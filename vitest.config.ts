import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', 'tests/setup.ts'],
    },
  },
  resolve: {
    alias: {
      '@': './src',
      '@apis': './src/apis',
      '@config': './src/config',
      '@db': './src/db',
      '@middlewares': './src/middlewares',
      '@utils': './src/utils',
      '@types': './src/types',
    },
  },
});
