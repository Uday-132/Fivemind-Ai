/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'image.pollinations.ai'
    ]
  },
  // Minimal configuration to avoid build issues
  swcMinify: true,
  productionBrowserSourceMaps: false,
  // Simple webpack config
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  }
}

module.exports = nextConfig