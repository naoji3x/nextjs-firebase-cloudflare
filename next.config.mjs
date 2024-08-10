// code for cloudflare development -- start
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/5712c57ea7/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}
// code for cloudflare development -- end

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude test files from the build
    config.module.rules.push({
      test: /\.(test|stories|mock)\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader'
    })

    return config
  }
}

export default nextConfig
