/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false, // enable browser source map generation during the production build
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    // appDir: true,
  },
  // fix all before production. Now it slow the develop speed.
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
    ignoreBuildErrors: true,
  },
  output: 'standalone',
 
  async rewrites() {
    return [
      {
        // Vercel 服务端将 /dify-beta/* 转发到 http://159.75.185.246/*
        // 浏览器只看到 https 域名，解决 Mixed Content 问题
        source: '/dify-beta/:path*',
        destination: 'http://159.75.185.246/:path*',
      },
    ]
  },
}
module.exports = nextConfig
