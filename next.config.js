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
  // Disable problematic features that cause build issues
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'sharp'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  // Webpack configuration to handle problematic packages
  webpack: (config, { isServer, dev }) => {
    // Reduce recursion depth to prevent stack overflow
    config.resolve.symlinks = false;
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    // Exclude problematic packages
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('puppeteer', 'sharp');
    }
    
    // Optimize module resolution
    config.resolve.modules = ['node_modules'];
    
    // Prevent circular dependencies
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  // Disable source maps in production to reduce build complexity
  productionBrowserSourceMaps: false,
  // Environment variables (Vercel will handle these automatically)
  env: {
    DATABASE_URL: process.env.DATABASE_URL || '',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    FIGMA_ACCESS_TOKEN: process.env.FIGMA_ACCESS_TOKEN || '',
    SESSION_SECRET: process.env.SESSION_SECRET || '',
  }
}

module.exports = nextConfig