import { defineConfig } from 'vitest/config';

    export default defineConfig({
        test: {
            environment: 'jsdom',
            setupFiles: ['./__test__/setup.ts'],
            globals: true
          }
      })