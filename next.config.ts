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
    const socialRedirects = Object.entries(siteConfig.links).map(([key, value]) => ({
      source: `/${key}`,
      destination: key === 'github' && typeof value === 'object' ? value.org : (value as string),
      permanent: false,
    }));

    return [
      {
        source: '/api/:rest((?:[^v].*|v(?:[^12].*|$)))',
        destination: '/api/v1/:rest*',
        permanent: true,
      },
      ...socialRedirects,
    ];
  },
};

export default nextConfig;
