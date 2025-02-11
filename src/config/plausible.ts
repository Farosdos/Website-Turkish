import { siteConfig } from './site';

export const plausibleConfig = {
  selfHosted: true,
  customDomain: process.env.PLAUSIBLE_CUSTOM_DOMAIN || 'https://plausible.meteors.cc',
  domain: new URL(siteConfig.url).hostname,
  trackFileDownloads: true,
  trackOutboundLinks: true,
} as const;
