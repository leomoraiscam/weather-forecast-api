import Redis, { Redis as RedisClient } from 'ioredis';

import { TypesLogger } from '@config/constants/types-logger-enum';
import { PinoLoggerProvider } from '@src/infrastructure/providers/logger-provider/pino-logger-service';

import { cacheConfig } from './config';

export class RedisConnection {
  private static client: RedisClient | null = null;

  public static getClient(): RedisClient {
    const loggerProvider = new PinoLoggerProvider();

    if (!RedisConnection.client) {
      RedisConnection.client = new Redis(cacheConfig.config.redis);

      RedisConnection.client.on('connect', () => {
        loggerProvider.log({
          level: TypesLogger.INFO,
          message: 'Redis connected successfully',
        });
      });

      RedisConnection.client.on('error', (err) => {
        loggerProvider.log({
          level: TypesLogger.ERROR,
          message: 'Redis connection error:',
          metadata: { error: err },
        });
      });
    }

    return RedisConnection.client;
  }
}
