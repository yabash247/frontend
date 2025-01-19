import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { backendURL } from './src/Utils/Constants'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendURL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  }
})
