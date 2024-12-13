import { RateLimiterRedis } from 'rate-limiter-flexible';

import { IRateLimiter } from '@src/application/contracts/providers/rate-limiter/rate-limiter-provider';
import { RedisConnection } from '@src/infrastructure/database/redis/connection';

export class RateLimiterFlexible implements IRateLimiter {
  private limiter: RateLimiterRedis;

  constructor() {
    const redisClient = RedisConnection.getClient();

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
