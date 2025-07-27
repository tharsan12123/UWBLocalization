import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/UWBLocalization/', // Your repo name
  plugins: [react()],
});
