import path from 'path'
import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

export default defineConfig({
  build: {
    outDir: 'lib',
    rollupOptions: {
      input: 'src/index.ts', // ここでエントリーポイントを指定
      output: {
        format: 'cjs' // commonjs形式で出力
      }
      // external: ['../shared'] // expressを外部モジュールとして扱う
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // エイリアス設定
      shared: path.resolve(__dirname, '../shared') // エイリアス設定
    }
  },
  plugins: [
    // eslint-disable-next-line new-cap
    ...VitePluginNode({
      // Nodejs native Request adapter
      adapter: 'express',

      // tell the plugin where is your project entry
      appPath: 'src/index.ts',

      // The TypeScript compiler you want to use
      tsCompiler: 'tsc'
    })
  ]
})
