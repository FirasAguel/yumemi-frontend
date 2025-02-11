import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    setupFiles: ['./setupTests.ts'],
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        '**/next.config.ts',
        '**/postcss.config.mjs',
        '**/tailwind.config.ts',
        '**/eslint.config.mjs',
        '**/next-env.d.ts',
        '**/vitest.config.mts',
        '**/.next/**',
        '**/app/layout.tsx',
        '**/app/loading.tsx',
        '**/services/api.ts',
      ],
    },
  },
});
