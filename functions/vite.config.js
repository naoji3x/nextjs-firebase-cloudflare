import path from 'path'
import { defineConfig } from 'vite'
import { VitePluginNode as vitePluginNode } from 'vite-plugin-node'

export default defineConfig({
  build: {
    outDir: 'lib',
    rollupOptions: {
      input: 'src/index.ts' // ここでエントリーポイントを指定
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // エイリアス設定
    }
  },
  plugins: [
    ...vitePluginNode({
      // Nodejs native Request adapter
      adapter: 'express',

      // tell the plugin where is your project entry
      appPath: 'src/index.ts'
    })
  ]
})
