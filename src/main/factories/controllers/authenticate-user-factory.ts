import { UserRepository } from '@src/modules/accounts/repositories/implementations/users-repository';
import { AuthenticateUser } from '@src/modules/accounts/usecases/authenticate-user/authenticate-user';
import { AuthenticateUserController } from '@src/modules/accounts/usecases/authenticate-user/authenticate-user-controller';
import { RequiredFieldsValidator } from '@src/shared/logic/validators/required-fields-validator';

import { IController } from '../../adapters/ports/controller';

export const makeAuthenticateUserController = (): IController => {
  const userRepository = new UserRepository();
  const authenticateUser = new AuthenticateUser(userRepository);

  const validator = new RequiredFieldsValidator();

  const authenticateUserController = new AuthenticateUserController(authenticateUser, validator);

  return authenticateUserController;
};
