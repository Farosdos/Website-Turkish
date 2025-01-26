import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitData {
  count: number;
  lastReset: number;
}

interface PathConfig {
  limit: number;
  windowMs: number;
}

const rateLimitMap = new Map<string, RateLimitData>();

const pathConfigs: Record<string, PathConfig> = {
  '/api/builds': { limit: 20, windowMs: 60_000 },
  '/api/builds/latest': { limit: 10, windowMs: 60_000 },
};

function getClientIP(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  return xff ? xff.split(',')[0].trim() : '127.0.0.1';
}

function getRateLimitHeaders(data: RateLimitData, config: PathConfig) {
  const resetTime = Math.floor((data.lastReset + config.windowMs) / 1000);
  const remaining = Math.max(0, config.limit - data.count);

  return {
    'X-RateLimit-Limit': config.limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString(),
  };
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const pathConfig = Object.entries(pathConfigs).find(([p]) => path.startsWith(p))?.[1];

  if (!pathConfig) return NextResponse.next();

  const key = `${getClientIP(request)}:${path}`;
  const now = Date.now();

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 0, lastReset: now });
  }

  const data = rateLimitMap.get(key)!;

  if (now - data.lastReset > pathConfig.windowMs) {
    data.count = 0;
    data.lastReset = now;
  }

  data.count++;

  const headers = getRateLimitHeaders(data, pathConfig);
  const response = NextResponse.next();
  Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));

  if (data.count > pathConfig.limit) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  return response;
}

export const config = {
  matcher: ['/api/builds/:path*'],
};
