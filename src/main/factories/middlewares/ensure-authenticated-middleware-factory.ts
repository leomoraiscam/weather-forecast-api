import { Middleware } from '../../adapters/ports/middleware'
import { EnsureAuthenticatedMiddleware } from '@src/shared/http/middlewares/ensure-authenticated-middleware'

export function makeEnsureAuthenticatedMiddleware(): Middleware {
  const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware()

  return ensureAuthenticatedMiddleware
}
