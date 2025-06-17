const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  
  // Enable experimental features if needed
  experimental: {
    // serverComponentsExternalPackages: ['@neon-database/serverless'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add any custom webpack configuration here
    return config;
  },
}

export default nextConfig;
