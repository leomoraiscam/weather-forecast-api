/* eslint-disable @typescript-eslint/no-namespace */
import { decode } from 'jsonwebtoken';

import { IMiddleware } from '@src/main/adapters/ports/middleware';
import { IControllerError } from '@src/shared/errors/ports/controller-error';

import { IEnsureAuthenticateMiddlewareRequestDTO } from '../dtos/ensure-authenticate-middleware-request';
import { IHttpResponse } from '../dtos/http-response';
import { ok, unauthorized } from '../helpers/http-helper';
import { AccessDeniedError } from './errors/access-denied-error';

type DecodedJwt = {
  id: string;
};

export class EnsureAuthenticateMiddleware implements IMiddleware {
  constructor() {}

  async handle(
    request: IEnsureAuthenticateMiddlewareRequestDTO,
  ): Promise<IHttpResponse<{ userId: string } | IControllerError>> {
    try {
      const { accessToken } = request;

      if (accessToken) {
        try {
          const decoded = decode(accessToken) as DecodedJwt;

          return ok({ userId: decoded.id });
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
