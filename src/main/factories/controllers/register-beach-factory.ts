import { IController } from '@src/presentation/contracts/controller';
import { RegisterBeachController } from '@src/presentation/controllers/register-beach-controller';
import { WebController } from '@src/presentation/controllers/web-controller';

import { makeRegisterBeachUseCase } from '../usecases/register-beach-factory';

export const makeRegisterBeachController = (): IController => {
  const registerBeachController = new WebController(
    new RegisterBeachController(makeRegisterBeachUseCase()),
  );

  return registerBeachController;
};
