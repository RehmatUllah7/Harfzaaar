import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // 👈 Enables external access (like from your phone)
    port: 5173, // Optional, but you can specify
  },
});
