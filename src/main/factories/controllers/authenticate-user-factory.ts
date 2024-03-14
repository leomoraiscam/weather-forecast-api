import { UserRepository } from '@src/external/database/mongodb/implementations/user-repository';
import { IController } from '@src/main/adapters/ports/controller';
import { AuthenticateUserController } from '@src/modules/accounts/usecases/authenticate-user/authenticate-user-controller';
import { AuthenticateUserUseCase } from '@src/modules/accounts/usecases/authenticate-user/authenticate-user-use-case';
import { RequiredFieldsValidator } from '@src/shared/validators/required-fields-validator';

export const makeAuthenticateUserController = (): IController => {
  const userRepository = new UserRepository();
  const authenticateUser = new AuthenticateUserUseCase(userRepository);
  const validator = new RequiredFieldsValidator();
  const authenticateUserController = new AuthenticateUserController(authenticateUser, validator);

  return authenticateUserController;
};
