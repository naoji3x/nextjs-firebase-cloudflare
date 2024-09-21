// code for cloudflare development -- start
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/5712c57ea7/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}
// code for cloudflare development -- end

import withSerwistInit from '@serwist/next'
import fs from 'fs'
import path from 'path'

const packageJsonPath = path.resolve(process.cwd(), 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
const { version } = packageJson

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  // サインアウト時に"The service worker navigation preload request was cancelled before 'preloadResponse' settled."のエラーが出ないよう、
  // "/"へのリダイレクト時は無効化する。next-authのsignOut()でのリダイレクトが十分に待たれないため？
  exclude: ['/signin', '/signout']
})

/** @type {import('next').NextConfig} */
const nextConfig = withSerwist({
  webpack: (config, { isServer }) => {
    // Exclude test files from the build
    config.module.rules.push({
      test: /\.(test|stories|mock)\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader'
    })

    return config
  },
  // Testing next.js app with t3-env / Cannot use import statement outside a module
  // https://www.reddit.com/r/nextjs/comments/1d6cuvg/testing_nextjs_app_with_t3env_cannot_use_import/
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
  env: {
    NEXT_PUBLIC_VERSION: version
  }
  // PWAで"manifest.json:1 Manifest: Line: 1, column: 1, Syntax error."が出るのを回避（少なく）するための設定
  // crossOrigin: 'use-credentials'
})

export default nextConfig
