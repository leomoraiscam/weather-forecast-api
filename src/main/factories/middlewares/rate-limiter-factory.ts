import { RateLimiterFlexibleProvider } from '@src/infrastructure/providers/rate-limiter-provider/rate-limiter-flexible-provider';
import { IMiddleware } from '@src/presentation/contracts/middleware';
import { RateLimiterMiddleware } from '@src/presentation/middlewares/rate-limiter-middleware';

export function makeRateLimiterMiddleware(): IMiddleware {
  const rateLimiterFlexibleProvider = new RateLimiterFlexibleProvider();
  const rateLimiterMiddleware = new RateLimiterMiddleware(rateLimiterFlexibleProvider);

  return rateLimiterMiddleware;
}
