import { RateLimiterMiddleware } from '@src/shared/http/middlewares/rate-limite';

import { IMiddleware } from '../../adapters/ports/middleware';

export function makeEnsureRateLimiterMiddleware(): IMiddleware {
  const ensureRateLimiterMiddleware = new RateLimiterMiddleware();

  return ensureRateLimiterMiddleware;
}
