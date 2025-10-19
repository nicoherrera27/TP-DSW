import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],

  server: {
    port: 4321,
    host: true
  },

  // o 'server' si necesitamos SSR
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  }
});