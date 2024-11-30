import Redis, { Redis as RedisClient } from 'ioredis';

import { ICacheProvider } from '@src/application/interfaces/providers/cache-provider';
import cacheConfig from '@src/external/database/redis/config/cache';

export class RedisCacheService implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  async save<T>(key: string, value: T): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async recover<T>(key: string): Promise<T> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = await this.client.pipeline();

    keys.forEach((key) => pipeline.del(key));

    await pipeline.exec();
  }
}
