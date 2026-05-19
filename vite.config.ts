/**
 * Vite 构建配置
 *
 * 仅负责打包渲染进程（React + CSS），产物输出到 dist/renderer。
 * 主进程和 preload 由 tsc 单独编译（tsconfig.node.json）。
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',
  plugins: [react()],
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: false
  },
  server: {
    port: 5173,
    strictPort: true
  }
})
