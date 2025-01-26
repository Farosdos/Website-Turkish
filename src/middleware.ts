import { NextResponse, NextRequest } from "next/server";
import { RateLimiter } from "~/lib/ratelimiter";

const rateLimiter = new RateLimiter();

const pathConfigs = new Map([
  ['/api/builds', { limit: 20, windowMs: 60_000 }],
  ['/api/builds/latest', { limit: 10, windowMs: 60_000 }]
]);

export const config = {
  matcher: ['/api/builds/:path*'],
};

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  let pathConfig: { limit: number; windowMs: number } | undefined;
  for (const [pattern, config] of pathConfigs) {
    if (path.startsWith(pattern)) {
      pathConfig = config;
      break;
    }
  }

  if (!pathConfig) return NextResponse.next();

  const key = `${getClientIP(request)}:${path}`;
  const { isAllowed, headers } = rateLimiter.check(key, pathConfig.limit, pathConfig.windowMs);

  if (!isAllowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const response = NextResponse.next();

  Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}