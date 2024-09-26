import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

export default defineConfig({
  server: {
    fs: {
      cachedChecks: false
    },
    cors: {
      methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
      preflightContinue: false
    },
    proxy: {
      "/api":{
        target: "http://caddy:80"
      }
    }
  },
  plugins: [
    react(),
    svgr()
  ],
})