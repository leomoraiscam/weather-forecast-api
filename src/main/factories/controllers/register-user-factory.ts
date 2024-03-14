import { UserRepository } from '@src/external/database/mongodb/implementations/user-repository';
import { IController } from '@src/main/adapters/ports/controller';
import { RegisterUserController } from '@src/modules/accounts/usecases/register-user/register-user-controller';
import { RegisterUserUseCase } from '@src/modules/accounts/usecases/register-user/register-user-use-case';
import { RequiredFieldsValidator } from '@src/shared/validators/required-fields-validator';

export const makeRegisterUserController = (): IController => {
  const userRepository = new UserRepository();
  const registerUserUseCase = new RegisterUserUseCase(userRepository);
  const validator = new RequiredFieldsValidator();
  const registerUserController = new RegisterUserController(registerUserUseCase, validator);

  return registerUserController;
};
