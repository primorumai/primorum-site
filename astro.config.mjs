import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://primorum.ai',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
