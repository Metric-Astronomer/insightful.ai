import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
        background: 'src/background/index.ts',
        content: 'src/content/contentScript.ts',  // Updated path
      }
    },
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    hmr: true,
  }
})