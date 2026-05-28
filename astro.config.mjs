import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://1digit.co.uk',
  adapter: node({ mode: 'standalone' }),
  server: { host: '0.0.0.0', port: parseInt(process.env.PORT || '4321') },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    mdx(),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.startsWith('/admin') &&
               !path.startsWith('/api') &&
               !path.startsWith('/campaign') &&
               !path.startsWith('/ai-readiness-results') &&
               path !== '/404';
      },
    }),
  ],
});
