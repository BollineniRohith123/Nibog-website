const path = require('path');
const customModuleResolver = require('./custom-module-resolver');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false, // Set to false for stricter type checking
  },
  webpack: (config, { isServer, dev }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...customModuleResolver.resolve.alias,
      '@': path.join(__dirname, './')
    };
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false 
    };
    
    // Explicit source map configuration
    if (!isServer) {
      config.devtool = dev ? 'cheap-module-source-map' : 'source-map';
    }
    
    return config;
  },
  
  // Comprehensive source map settings
  productionBrowserSourceMaps: true,
  
  // Enhanced error handling
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false
  },
  
  images: {
    domains: ['example.com'], // Add domains for external images if needed
  },
  
  // Environment variables
  env: {
    // Add any global environment variables here
    DATABASE_URL: process.env.DATABASE_URL,

    // Clerk configurations
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,

    // Other service configurations
    PHONEPE_MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
  },

  // Logging configuration
  logging: {
    level: 'error'
  }
}

module.exports = nextConfig
