import { LRUCache } from 'lru-cache';

import type { NextRequest } from 'next/server';

type RatelimitConfig = {
  limit: number;
  windowMs: number;
};

type RatelimiterOptions = {
  paths: Record<string, RatelimitConfig>;
  max?: number;
  ttl?: number;
};

export class Ratelimiter {
  private cache: LRUCache<string, number>;
  private paths: Record<string, RatelimitConfig>;

  constructor(options: RatelimiterOptions) {
    this.cache = new LRUCache<string, number>({
      max: options.max ?? 10_000,
      ttl: options.ttl ?? 1000 * 60 * 2, // default: 2 minutes
      updateAgeOnGet: false,
    });

    this.paths = options.paths;
  }

  private getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  }

  private getPathConfig(path: string): RatelimitConfig | undefined {
    return Object.entries(this.paths).find(([pattern]) => path.startsWith(pattern))?.[1];
  }

  evaluate(request: NextRequest): {
    isAllowed: boolean;
    headers: Record<string, string>;
  } | null {
    const path = request.nextUrl.pathname;
    const config = this.getPathConfig(path);

    if (!config) return null;

    const ip = this.getClientIP(request);
    const key = `${ip}:${path}`;
    const now = Date.now();
    const count = (this.cache.get(key) || 0) + 1;

    this.cache.set(key, count);

    const resetTime = Math.floor((now + config.windowMs) / 1000);
    const remaining = Math.max(0, config.limit - count);

    return {
      isAllowed: count <= config.limit,
      headers: {
        'X-RateLimit-Limit': config.limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      },
    };
  }
}
