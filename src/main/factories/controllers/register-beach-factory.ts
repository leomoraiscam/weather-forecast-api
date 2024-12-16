import { IController } from '@src/presentation/contracts/controller';
import { RegisterBeachController } from '@src/presentation/controllers/register-beach-controller';

import { makeRegisterBeachUseCase } from '../usecases/register-beach-factory';

export const makeRegisterBeachController = (): IController => {
  const registerBeachController = new RegisterBeachController(makeRegisterBeachUseCase());

  return registerBeachController;
};
