import { JWTTokenManagerProvider } from '@src/infrastructure/providers/token-manager-provider/jwt-token-manager-provider';
import { IMiddleware } from '@src/presentation/contracts/middleware';
import { AuthenticateMiddleware } from '@src/presentation/middlewares/authenticate-middleware';

export function makeAuthenticateMiddleware(): IMiddleware {
  const jWTTokenManagerProvider = new JWTTokenManagerProvider();
  const authenticateMiddleware = new AuthenticateMiddleware(jWTTokenManagerProvider);

  return authenticateMiddleware;
}
