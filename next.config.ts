import type { NextConfig } from 'next';
import { siteConfig } from '~/siteconfig';

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
    const socialRedirects = Object.entries(siteConfig.social).map(([key, value]) => ({
      source: `/${key}`,
      destination: key === 'github' && typeof value === 'object' ? value.org : (value as string),
      permanent: false,
    }));

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
      ...socialRedirects,
    ];
  },
};

export default nextConfig;
