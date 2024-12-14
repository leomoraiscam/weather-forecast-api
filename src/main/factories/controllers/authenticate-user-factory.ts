import { IController } from '@src/main/adapters/ports/controller';
import { AuthenticateUserController } from '@src/presentation/controllers/authenticate-user-controller';

import { makeAuthenticateUserUseCase } from '../usecases/authenticate-user-factory';

export const makeAuthenticateUserController = (): IController => {
  const authenticateUserController = new AuthenticateUserController(makeAuthenticateUserUseCase());

  return authenticateUserController;
};
