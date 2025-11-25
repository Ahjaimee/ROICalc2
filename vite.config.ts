import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative asset paths so the calculator can be opened directly from the built files
  // (e.g. when hosted on a CDN subpath or previewed locally from the dist folder).
  base: './',
  plugins: [react()],
});
