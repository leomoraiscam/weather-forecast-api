import { IController } from '@src/presentation/contracts/controller';
import { RegisterUserController } from '@src/presentation/controllers/register-user-controller';

import { makeRegisterUserUseCase } from '../usecases/register-user-factory';

export const makeRegisterUserController = (): IController => {
  const registerUserController = new RegisterUserController(makeRegisterUserUseCase());

  return registerUserController;
};
