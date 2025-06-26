import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'node18',
    ssr: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/server.ts'),
      output: {
        format: 'es',
        entryFileNames: 'server.js',
      },
      external: [
        // Mark all node_modules as external
        /^node:/,
        ...Object.keys(require('./package.json').dependencies || {}),
      ],
    },
    outDir: 'dist',
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});