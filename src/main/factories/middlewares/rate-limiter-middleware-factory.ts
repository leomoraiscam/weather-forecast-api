import { RateLimiterMiddleware } from '@src/shared/http/middlewares/rate-limiter-middleware';

import { IMiddleware } from '../../adapters/ports/middleware';

export function makeRateLimiterMiddleware(): IMiddleware {
  const rateLimiterMiddleware = new RateLimiterMiddleware();

  return rateLimiterMiddleware;
}
