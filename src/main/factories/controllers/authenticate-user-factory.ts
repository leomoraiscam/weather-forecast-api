import { UserRepository } from '@src/modules/accounts/repositories/implementations/user-repository';
import { AuthenticateUserController } from '@src/modules/accounts/usecases/authenticate-user/authenticate-user-controller';
import { AuthenticateUserUseCase } from '@src/modules/accounts/usecases/authenticate-user/authenticate-user-use-case';
import { RequiredFieldsValidator } from '@src/shared/validators/required-fields-validator';

import { IController } from '../../adapters/ports/controller';

export const makeAuthenticateUserController = (): IController => {
  const userRepository = new UserRepository();
  const authenticateUser = new AuthenticateUserUseCase(userRepository);
  const validator = new RequiredFieldsValidator();
  const authenticateUserController = new AuthenticateUserController(authenticateUser, validator);

  return authenticateUserController;
};
