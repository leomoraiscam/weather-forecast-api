import { AuthenticateUserUseCase } from '@src/application/usecases/users/authenticate-user/authenticate-user-use-case';
import { IAuthenticateUser } from '@src/application/usecases/users/authenticate-user/contracts/authenticate-user-interface';
import { UserRepository } from '@src/infrastructure/database/mongo/repositories/users/user-repository';
import { JWTTokenManagerProvider } from '@src/infrastructure/providers/token-manager-provider/jwt-token-manager-provider';

export const makeAuthenticateUserUseCase = (): IAuthenticateUser => {
  const userRepository = new UserRepository();
  const jWTTokenManagerProvider = new JWTTokenManagerProvider();
  const authenticateUser = new AuthenticateUserUseCase(userRepository, jWTTokenManagerProvider);

  return authenticateUser;
};
