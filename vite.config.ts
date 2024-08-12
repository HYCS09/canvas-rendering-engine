import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    hmr: false
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': join(__dirname, 'src/lib')
    }
  }
})
