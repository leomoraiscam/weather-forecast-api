import { limiter } from '@src/external/database/redis/config/rate-limiter';
import { IMiddleware } from '@src/main/adapters/ports/middleware';
import { IControllerError } from '@src/shared/errors/ports/controller-error';

import { IHttpResponse } from '../dtos/http-response';
import { IRateLimiterMiddlewareRequestDTO } from '../dtos/rate-limiter-middleware-request';
import { toManyRequests, ok } from '../helpers/http-helper';
import { TooManyRequestsError } from './errors/too-many-requests-error';

export class RateLimiterMiddleware implements IMiddleware {
  constructor() {}

  async handle(
    request: IRateLimiterMiddlewareRequestDTO,
  ): Promise<IHttpResponse<{ success: boolean } | IControllerError>> {
    try {
      const { ip } = request;

      await limiter.consume(ip);

      return ok({ success: true });
    } catch (error) {
      return toManyRequests(new TooManyRequestsError());
    }
  }
}
