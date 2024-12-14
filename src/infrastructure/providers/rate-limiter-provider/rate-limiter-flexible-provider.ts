import { RateLimiterRedis } from 'rate-limiter-flexible';

import { IRateLimiterProvider } from '@src/application/contracts/providers/rate-limiter-provider/rate-limiter-provider';
import { RedisConnection } from '@src/infrastructure/database/redis/connection';

export class RateLimiterFlexibleProvider implements IRateLimiterProvider {
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
