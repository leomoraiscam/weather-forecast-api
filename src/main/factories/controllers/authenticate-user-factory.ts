import { AuthenticateUserUseCase } from '@src/application/usecases/users/authenticate-user/authenticate-user-use-case';
import { UserRepository } from '@src/infrastructure/database/mongo/repositories/users/user-repository';
import { JWTTokenManagerProvider } from '@src/infrastructure/providers/token-manager/jwt-token-manager-provider';
import { IController } from '@src/main/adapters/ports/controller';
import { AuthenticateUserController } from '@src/presentation/controllers/authenticate-user-controller';

export const makeAuthenticateUserController = (): IController => {
  const userRepository = new UserRepository();
  const jWTTokenManagerProvider = new JWTTokenManagerProvider();
  const authenticateUser = new AuthenticateUserUseCase(userRepository, jWTTokenManagerProvider);
  const authenticateUserController = new AuthenticateUserController(authenticateUser);

  return authenticateUserController;
};
