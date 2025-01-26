import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/api/latest',
        destination: '/api/v1/latest',
        permanent: true,
      },
      {
        source: '/api/builds',
        destination: '/api/v1/builds',
        permanent: true,
      },
      {
        source: '/api/specific',
        destination: '/api/v1/specific',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
