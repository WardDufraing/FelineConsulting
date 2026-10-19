import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://feline-consulting.be/',
  trailingSlash: 'always',
  output: 'server',
  adapter: vercel(),
  integrations: [mdx(), react()],
});