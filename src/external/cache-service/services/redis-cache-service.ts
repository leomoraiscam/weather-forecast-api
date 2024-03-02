import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@src/external/database/redis/config/cache';

import { ICacheService } from '../ports/cache-service';

export class RedisCacheService implements ICacheService {
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
}
