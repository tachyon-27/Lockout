import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config({
  path: "../.env"
})


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`,
      },
    },
  },
  plugins: [react()],
})
