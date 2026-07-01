import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this as a project site under /projekt-vn/, but keep the
  // local dev server at the root so `npm run dev` still opens at localhost:5173/.
  base: command === 'build' ? '/projekt-vn/' : '/',
  plugins: [react(), tailwindcss()],
}))
