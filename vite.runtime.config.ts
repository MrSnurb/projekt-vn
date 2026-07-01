import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Builds the standalone, framework-free-to-consume player bundle that gets inlined
// into every exported HTML game. Kept as a separate build so the editor app's own
// build isn't polluted by this bundle, and so the output is a single predictable
// runtime.js/runtime.css pair that exportHtml.ts can import as raw text.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'src/export/html/generated',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/export/html/playerRuntimeEntry.tsx'),
      name: 'VNRuntime',
      formats: ['iife'],
      fileName: () => 'runtime.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'runtime.[ext]',
      },
    },
  },
})
