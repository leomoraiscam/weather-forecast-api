import { decode } from 'jsonwebtoken';
import {
  EnsureAuthenticatedMiddlewareRequest,
  DecodedJwt,
} from '../dtos/ensure-authenticated-middleware';
import { HttpResponse } from '../dtos/http-response';
import { ok, forbidden, serverError } from '../helpers/http-helper';
import { ControllerError } from '@src/shared/errors/ports/controller-error';
import { Middleware } from '@src/main/adapters/ports/middleware';

export class EnsureAuthenticatedMiddleware implements Middleware {
  constructor() {}

  async handle(
    request: EnsureAuthenticatedMiddlewareRequest,
  ): Promise<HttpResponse<{ userId: string } | ControllerError>> {
    try {
      const { accesstoken } = request;

      if (accesstoken) {
        try {
          const decoded = decode(accesstoken) as DecodedJwt;

          return ok({ userId: decoded.sub });
        } catch (err) {
          return forbidden({
            name: 'AccessDeniedError',
            message: 'Access denied.',
          });
        }
      }

      return forbidden({
        name: 'AccessDeniedError',
        message: 'Access denied.',
      });
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accesstoken?: string;
  };
}
