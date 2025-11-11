/** @type {import('next').NextConfig} */
const nextConfig = {
  /* whatever you already had */
  async rewrites() {
    return [
      {
        source: '/api/:path*',       // every /api/... request
        destination: 'http://localhost:3002/api/:path*', // goes to Nest
      },
    ];
  },
};

module.exports = nextConfig;