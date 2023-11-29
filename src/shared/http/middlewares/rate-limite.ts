/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient } from 'redis';

import { IMiddleware } from '@src/main/adapters/ports/middleware';

import { IHttpResponse } from '../dtos/http-response';
import { toManyRequests, ok } from '../helpers/http-helper';

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimit',
  points: 5,
  duration: 2,
});

export class RateLimiterMiddleware implements IMiddleware {
  constructor() {}

  async handle(request: any): Promise<IHttpResponse<any>> {
    try {
      const { ip } = request;

      await limiter.consume(ip);

      return ok({ sucess: true });
    } catch (error) {
      return toManyRequests(error);
    }
  }
}
