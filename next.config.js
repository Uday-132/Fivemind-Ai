/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'image.pollinations.ai',
      'api.imggen.ai',
      'oaidalleapiprodscus.blob.core.windows.net' // ✅ Use exact hostname here
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
        hostname: 'oaidalleapiprodscus.blob.core.windows.net', // ✅ Corrected
        port: '',
        pathname: '/**',
      }
    ]
  },
  swcMinify: true,
  productionBrowserSourceMaps: false,
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizeCss: false, // ✅ Optional: prevent rare trace bugs
  },
  // Disable build trace collection to prevent stack overflow
  outputFileTracing: false,
  webpack: (config, { isServer }) => {
    // Minimal webpack config to prevent circular references
    config.resolve.symlinks = false;
    
    // Simple alias setup
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };
    
    return config;
  },
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    FIGMA_ACCESS_TOKEN: process.env.FIGMA_ACCESS_TOKEN || '',
    SESSION_SECRET: process.env.SESSION_SECRET || '',
  }
};

module.exports = nextConfig;
