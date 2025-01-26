import { Ratelimiter } from '~/lib/ratelimiter';

import { NextRequest, NextResponse } from 'next/server';

const ratelimiter = new Ratelimiter({
  paths: {
    '/api/builds': { limit: 20, windowMs: 60_000 },
    '/api/builds/latest': { limit: 10, windowMs: 60_000 },
  },
});

export const config = {
  matcher: ['/api/builds/:path*'],
};

export function middleware(request: NextRequest) {
  const result = ratelimiter.evaluate(request);

  if (!result) return NextResponse.next();

  if (!result.isAllowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          ...result.headers,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const response = NextResponse.next();
  Object.entries(result.headers).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}
