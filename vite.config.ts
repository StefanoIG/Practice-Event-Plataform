import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Aquí es donde se generan los archivos para producción
  },
  server: {
    port: 3000,
  },
});
