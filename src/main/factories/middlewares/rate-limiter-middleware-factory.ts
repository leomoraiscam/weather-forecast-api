import { IMiddleware } from '@src/main/adapters/ports/middleware';
import { RateLimiterMiddleware } from '@src/shared/http/middlewares/rate-limiter-middleware';

export function makeRateLimiterMiddleware(): IMiddleware {
  const rateLimiterMiddleware = new RateLimiterMiddleware();

  return rateLimiterMiddleware;
}
