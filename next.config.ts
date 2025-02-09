import type { NextConfig } from 'next';
import { siteConfig } from '~/config/site';

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
        source: '/api/:rest((?:[^v].*|v(?:[^12].*|$)))',
        destination: '/api/v1/:rest*',
        permanent: true,
      },
      ...Object.entries(siteConfig.links).map(([path, url]) => ({
        source: `/${path}`,
        destination:
          typeof url === 'object' && 'github' in url
            ? (url as { github: { org: string } }).github.org
            : (url as string),
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
