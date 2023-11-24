import { UserRepository } from '@src/modules/accounts/repositories/implementations/users-repository';
import { AuthenticateUser } from '@src/modules/accounts/usecases/authenticate-user/authenticate-user';
import { AuthenticateUserController } from '@src/modules/accounts/usecases/authenticate-user/authenticate-user-controller';

import { IController } from '../../adapters/ports/controller';

export const makeAuthenticateUserController = (): IController => {
  const userRepository = new UserRepository();
  const authenticateUser = new AuthenticateUser(userRepository);
  const authenticateUserController = new AuthenticateUserController(authenticateUser);

  return authenticateUserController;
};
