// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- 1. Uvezi ovaj plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- 2. Pokreni ga ovdje
  ],
})