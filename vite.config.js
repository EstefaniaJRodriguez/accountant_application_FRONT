import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // o "0.0.0.0"
    allowedHosts: [
      '268758491758.ngrok-free.app',
       'https://accountant-application.onrender.com',
       'https://www.genimpositivo.com'// <--- agregá tu dominio ngrok aquí
    ]
  }
})
