/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com',
      'image.pollinations.ai',
      'api.imggen.ai',
      'oaidalleapiprodscus.blob.core.windows.net'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      }
    ]
  },
  // Optimize for Vercel deployment
  swcMinify: true,
  productionBrowserSourceMaps: false,
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  },
  // Environment variables (only expose what's needed)
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    FIGMA_ACCESS_TOKEN: process.env.FIGMA_ACCESS_TOKEN || '',
    SESSION_SECRET: process.env.SESSION_SECRET || '',
  }
}

module.exports = nextConfig