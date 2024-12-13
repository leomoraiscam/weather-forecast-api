import { RateLimiterFlexible } from '@src/infrastructure/providers/rate-limiter-provider/rate-limiter-flexible-provider';
import { IMiddleware } from '@src/main/adapters/ports/middleware';
import { RateLimiterMiddleware } from '@src/presentation/middlewares/rate-limiter-middleware';

export function makeRateLimiterMiddleware(): IMiddleware {
  const rateLimiterFlexibleProvider = new RateLimiterFlexible();
  const rateLimiterMiddleware = new RateLimiterMiddleware(rateLimiterFlexibleProvider);

  return rateLimiterMiddleware;
}
