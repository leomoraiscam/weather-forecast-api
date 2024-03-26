import { IMiddleware } from '@src/main/adapters/ports/middleware';
import { EnsureAuthenticateMiddleware } from '@src/shared/http/middlewares/ensure-authenticate-middleware';

export function makeEnsureAuthenticateMiddleware(): IMiddleware {
  const ensureAuthenticatedMiddleware = new EnsureAuthenticateMiddleware();

  return ensureAuthenticatedMiddleware;
}
