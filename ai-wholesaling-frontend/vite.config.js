import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default {
  optimizeDeps: {
    include: ["react", "react-dom"] // Add packages you import frequently
  }
}