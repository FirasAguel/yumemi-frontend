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
    },
  },
});
