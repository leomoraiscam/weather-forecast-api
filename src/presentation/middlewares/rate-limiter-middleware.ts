import { IRateLimiter } from '@src/application/contracts/providers/rate-limiter-provider/rate-limiter-provider';

import { IHttpResponse } from '../contracts/http-response';
import { IMiddleware } from '../contracts/middleware';
import { TooManyRequestsError } from '../errors/too-many-requests-error';
import { toManyRequests, ok } from '../helpers/http-helper';

type RateLimiterMiddlewareRequest = {
  ip: string;
};

export class RateLimiterMiddleware implements IMiddleware {
  constructor(private rateLimiter: IRateLimiter) {}

  async handle(request: RateLimiterMiddlewareRequest): Promise<IHttpResponse> {
    try {
      const { ip } = request;

      await this.rateLimiter.consume(ip);

      return ok({ success: true });
    } catch (error) {
      return toManyRequests(new TooManyRequestsError());
    }
  }
}
