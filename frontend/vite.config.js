import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from "path"

dotenv.config({
  path: "../.env"
})


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': `http://localhost:${process.env.VITE_BACKEND_PORT}`
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
