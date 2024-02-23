/* eslint-disable @typescript-eslint/no-namespace */
import { decode } from 'jsonwebtoken';

import { IMiddleware } from '@src/main/adapters/ports/middleware';
import { IControllerError } from '@src/shared/errors/ports/controller-error';

import { IEnsureAuthenticatedMiddlewareRequest } from '../dtos/ensure-authenticated-middleware-request';
import { IHttpResponse } from '../dtos/http-response';
import { ok, unauthorized } from '../helpers/http-helper';
import { AccessDeniedError } from './errors/AccessDeniedError';

type DecodedJwt = {
  sub: string;
};

export class EnsureAuthenticatedMiddleware implements IMiddleware {
  constructor() {}

  async handle(
    request: IEnsureAuthenticatedMiddlewareRequest,
  ): Promise<IHttpResponse<{ userId: string } | IControllerError>> {
    try {
      const { accessToken } = request;

      if (accessToken) {
        try {
          const decoded = decode(accessToken) as DecodedJwt;

          return ok({ userId: decoded.sub });
        } catch (err) {
          return unauthorized(new AccessDeniedError());
        }
      }

      return unauthorized(new AccessDeniedError());
    } catch (error) {
      return fail(error);
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string;
  };
}
