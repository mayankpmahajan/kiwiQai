// next.config.js
module.exports = {
  images: {
    domains: ['assets.aceternity.com'], // Allow images from this domain
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}
