/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.FRONTEND_PORT || '3000'),
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: [
        'text',
        'text-summary',
        'json-summary',
      ],
      reportOnFailure: true,
      skipFull: true,
      reportsDirectory: '../coverage/frontend',
      include: ['src/**/*'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/test/**/*',
        'src/lib/axios/index.ts',
        'src/main.tsx'
      ],
    },
  },
})
