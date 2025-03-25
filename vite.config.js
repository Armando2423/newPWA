import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3005, // Usa el puerto de Render o el 3005 localmente
    host: true // Permite acceder desde cualquier IP
  },
  preview: {
    port: process.env.PORT || 3000,
    host: true
  }
})
 