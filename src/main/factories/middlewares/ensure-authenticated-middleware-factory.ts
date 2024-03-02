import { IMiddleware } from '@src/main/adapters/ports/middleware';
import { EnsureAuthenticatedMiddleware } from '@src/shared/http/middlewares/ensure-authenticated-middleware';

export function makeEnsureAuthenticatedMiddleware(): IMiddleware {
  const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware();

  return ensureAuthenticatedMiddleware;
}
