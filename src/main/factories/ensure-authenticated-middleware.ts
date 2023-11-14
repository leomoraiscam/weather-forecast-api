import { Middleware } from '@src/shared/http/ports/middleware'
import { EnsureAuthenticatedMiddleware } from '@src/shared/http/middlewares/ensure-authenticated-middleware'

export function makeEnsureAuthenticatedMiddleware(): Middleware {
  const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware()

  return ensureAuthenticatedMiddleware
}
