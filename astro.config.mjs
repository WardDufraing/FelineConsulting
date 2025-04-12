// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

// https://astro.build/config
export default {
  output: 'server',
  adapter: cloudflare(),
  integrations: [react({
    // Disable SSR for React entirely
    // @ts-ignore
    ssr: false
  })],
};