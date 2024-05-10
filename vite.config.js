import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

export default defineConfig({
  server: {
    cors: false,
    proxy: {
      "/api": {
        target: "http://locahost:80"
      }
    }
  },
  plugins: [
    react(),
    svgr()
  ],
})