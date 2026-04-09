import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.{test,spec}.js'],
    coverage: {
      provider: 'v8',
      include: ['src/server/db-manager.js', 'public/js/shared/**/*.js'],
      reporter: ['text', 'json', 'html'],
    },
  },
});
