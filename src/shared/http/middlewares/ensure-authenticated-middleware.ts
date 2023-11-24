/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-namespace */
import { decode } from 'jsonwebtoken';

import { IMiddleware } from '@src/main/adapters/ports/middleware';
import { IControllerError } from '@src/shared/errors/ports/controller-error';

import {
  IEnsureAuthenticatedMiddlewareRequest,
  IDecodedJwt,
} from '../dtos/ensure-authenticated-middleware';
import { IHttpResponse } from '../dtos/http-response';
import { ok, forbidden, serverError } from '../helpers/http-helper';

export class EnsureAuthenticatedMiddleware implements IMiddleware {
  constructor() {}

  async handle(
    request: IEnsureAuthenticatedMiddlewareRequest,
  ): Promise<IHttpResponse<{ userId: string } | IControllerError>> {
    try {
      const { accesstoken } = request;

      if (accesstoken) {
        try {
          const decoded = decode(accesstoken) as IDecodedJwt;

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
