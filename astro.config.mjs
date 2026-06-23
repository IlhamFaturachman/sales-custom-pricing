import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  vite: {
    build: {
      minify: false
    }
  }
});
