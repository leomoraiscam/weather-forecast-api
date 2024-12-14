import { ITokenManagerProvider } from '@src/application/contracts/providers/token-manager-provider/token-manager-provider';

import { IHttpResponse } from '../contracts/http-response';
import { IMiddleware } from '../contracts/middleware';
import { AccessDeniedError } from '../errors/access-denied-error';
import { ok, unauthorized } from '../helpers/http-helper';

type AuthenticateMiddlewareRequest = {
  accessToken: string;
};

export class AuthenticateMiddleware implements IMiddleware {
  constructor(private tokenManagerProvider: ITokenManagerProvider) {}

  async handle(request: AuthenticateMiddlewareRequest): Promise<IHttpResponse> {
    try {
      const { accessToken } = request;

      if (accessToken) {
        try {
          const { id } = await this.tokenManagerProvider.verify(accessToken);

          return ok({ userId: id });
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
