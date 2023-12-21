import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@src/external/database/redis/config/cache';

import { ICacheProvider } from '../ports/cache-provider';

export class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  async save(key: string, value: any): Promise<void> {
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
