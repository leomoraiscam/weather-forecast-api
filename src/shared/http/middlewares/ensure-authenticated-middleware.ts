/* eslint-disable @typescript-eslint/no-namespace */
import { decode } from 'jsonwebtoken';

import { IMiddleware } from '@src/main/adapters/ports/middleware';
import { InvalidJWTTokenError } from '@src/modules/accounts/domain/user/errors/invalid-jwt-token-error';
import { IControllerError } from '@src/shared/errors/ports/controller-error';

import {
  IEnsureAuthenticatedMiddlewareRequest,
  IDecodedJwt,
} from '../dtos/ensure-authenticated-request';
import { IHttpResponse } from '../dtos/http-response';
import { ok, unauthorized } from '../helpers/http-helper';

export class EnsureAuthenticatedMiddleware implements IMiddleware {
  constructor() {}

  async handle(
    request: IEnsureAuthenticatedMiddlewareRequest,
  ): Promise<IHttpResponse<{ userId: string } | IControllerError>> {
    const { accesstoken } = request;

    if (!accesstoken) {
      return unauthorized(new InvalidJWTTokenError());
    }

    try {
      const decoded = decode(accesstoken) as IDecodedJwt;

      return ok({ userId: decoded.sub });
    } catch (error) {
      return unauthorized(new InvalidJWTTokenError());
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accesstoken?: string;
  };
}
