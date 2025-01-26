export class RateLimiter {
  private cache: Map<string, { count: number; lastReset: number }>;
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    this.cache = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60_000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, data] of this.cache.entries()) {
      if (now - data.lastReset > 120_000) {
        this.cache.delete(key);
      }
    }
  }

  check(
    key: string,
    limit: number,
    windowMs: number,
  ): {
    isAllowed: boolean;
    headers: Record<string, string>;
  } {
    const now = Date.now();
    let data = this.cache.get(key);

    if (!data) {
      data = { count: 0, lastReset: now };
      this.cache.set(key, data);
    }

    if (now - data.lastReset > windowMs) {
      data.count = 0;
      data.lastReset = now;
    }

    data.count++;

    const resetTime = Math.floor((data.lastReset + windowMs) / 1000);
    const remaining = Math.max(0, limit - data.count);

    return {
      isAllowed: data.count <= limit,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      },
    };
  }
}
