import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const BUILD_DATE = new Date().toISOString();

export default defineConfig({
  site: 'https://primorum.ai',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      serialize(item) {
        item.lastmod = BUILD_DATE;
        return item;
      },
    }),
  ],
});
