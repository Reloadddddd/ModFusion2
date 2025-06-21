import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', 'react-feather'], // Exclure react-feather aussi
  },
  build: {
    rollupOptions: {
      external: [], // Ne pas externaliser react-feather pour éviter l'erreur
    },
  },
});
