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
        hostname: '**.blob.core.windows.net',
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
  // Disable build trace collection to prevent stack overflow
  output: 'standalone',
  // Simplified webpack configuration
  webpack: (config, { isServer }) => {
    // Disable symlinks to prevent circular references
    config.resolve.symlinks = false;
    
    // Optimize resolve configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './'),
    };
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Optimize module resolution
    config.resolve.modules = ['node_modules'];
    
    return config;
  },
  // Environment variables (only expose what's needed)
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    FIGMA_ACCESS_TOKEN: process.env.FIGMA_ACCESS_TOKEN || '',
    SESSION_SECRET: process.env.SESSION_SECRET || '',
    // Don't expose DATABASE_URL in client-side code
  }
}

module.exports = nextConfig