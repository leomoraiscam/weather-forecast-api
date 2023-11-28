import { UserRepository } from '@src/modules/accounts/repositories/implementations/users-repository';
import { RegisterUserController } from '@src/modules/accounts/usecases/register-user/register-user-controller';
import { RegisterUserUseCase } from '@src/modules/accounts/usecases/register-user/register-user-use-case';
import { RequiredFieldsValidator } from '@src/shared/logic/validators/required-fields-validator';

import { IController } from '../../adapters/ports/controller';

export const makeRegisterUserController = (): IController => {
  const userRepository = new UserRepository();
  const registerUserUseCase = new RegisterUserUseCase(userRepository);

  const validator = new RequiredFieldsValidator();

  const registerUserController = new RegisterUserController(registerUserUseCase, validator);

  return registerUserController;
};
