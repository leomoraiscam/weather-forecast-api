import { IController } from '@src/presentation/contracts/controller';
import { AuthenticateUserController } from '@src/presentation/controllers/authenticate-user-controller';
import { WebController } from '@src/presentation/controllers/web-controller';

import { makeAuthenticateUserUseCase } from '../usecases/authenticate-user-factory';

export const makeAuthenticateUserController = (): IController => {
  const authenticateUserController = new WebController(
    new AuthenticateUserController(makeAuthenticateUserUseCase()),
  );

  return authenticateUserController;
};
