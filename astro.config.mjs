import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [mdx(), react()],
});