import { RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient, ClientOpts } from 'redis';

import { IRateLimiter } from '@src/application/contracts/providers/rate-limiter/rate-limiter-provider';
import cacheConfig from '@src/external/database/redis/config/cache';

export class RateLimiterFlexible implements IRateLimiter {
  private limiter: RateLimiterRedis;

  constructor() {
    const redisClient = createClient(cacheConfig.config.redis as unknown as ClientOpts);

    this.limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'rateLimit',
      points: 5,
      duration: 2,
    });
  }

  async consume(key: string): Promise<void> {
    await this.limiter.consume(key);
  }
}
