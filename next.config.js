/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://47.238.143.12:7000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig 