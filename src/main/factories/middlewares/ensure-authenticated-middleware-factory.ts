import { EnsureAuthenticatedMiddleware } from '@src/shared/http/middlewares/ensure-authenticated-middleware';

import { IMiddleware } from '../../adapters/ports/middleware';

export function makeEnsureAuthenticatedMiddleware(): IMiddleware {
  const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware();

  return ensureAuthenticatedMiddleware;
}
