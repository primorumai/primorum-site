import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import individualSkills from './src/data/individual-skills.json';

const BUILD_DATE = new Date().toISOString();
const NOINDEX_PATHS = new Set(
  individualSkills.filter((s) => !s.indexable).map((s) => `/skills/s/${s.slug}`),
);

export default defineConfig({
  site: 'https://primorum.ai',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\.html$/, '');
        return !NOINDEX_PATHS.has(path);
      },
      serialize(item) {
        item.lastmod = BUILD_DATE;
        return item;
      },
    }),
  ],
});
