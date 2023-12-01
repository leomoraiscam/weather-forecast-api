import { UserRepository } from '@src/modules/accounts/repositories/implementations/users-repository';
import { BeachRepository } from '@src/modules/forecast/repositories/implementations/beach-repository';
import { RegisterBeachController } from '@src/modules/forecast/usecases/register-beach/register-beach-controller';
import { RegisterBeachUseCase } from '@src/modules/forecast/usecases/register-beach/register-beach-use-case';
import { RequiredFieldsValidator } from '@src/shared/logic/validators/required-fields-validator';

import { IController } from '../../adapters/ports/controller';

export const makeRegisterBeachController = (): IController => {
  const beachRepository = new BeachRepository();
  const userRepository = new UserRepository();

  const registerBeachUseCase = new RegisterBeachUseCase(beachRepository, userRepository);

  const validator = new RequiredFieldsValidator();

  const registerBeachController = new RegisterBeachController(registerBeachUseCase, validator);

  return registerBeachController;
};
