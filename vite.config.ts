import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Exporta la configuración de Vite
export default defineConfig({
  plugins: [react()],
  build: {
    // Opcionalmente puedes cambiar la carpeta de salida (si es diferente a dist)
    outDir: 'dist',
    rollupOptions: {
      // Opciones para asegurar que el bundle esté bien hecho
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 3000, // Puedes cambiar el puerto local de desarrollo si quieres
  },
});
