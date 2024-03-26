import { BeachRepository } from '@src/external/database/mongodb/implementations/beach-repository';
import { UserRepository } from '@src/external/database/mongodb/implementations/user-repository';
import { RedisCacheService } from '@src/external/providers/cache-service/services/redis-cache-service';
import { IController } from '@src/main/adapters/ports/controller';
import { RegisterBeachController } from '@src/modules/forecast/usecases/register-beach/register-beach-controller';
import { RegisterBeachUseCase } from '@src/modules/forecast/usecases/register-beach/register-beach-use-case';
import { RequiredFieldsValidator } from '@src/shared/validators/required-fields-validator';

export const makeRegisterBeachController = (): IController => {
  const beachRepository = new BeachRepository();
  const userRepository = new UserRepository();
  const cacheService = new RedisCacheService();
  const registerBeachUseCase = new RegisterBeachUseCase(
    beachRepository,
    userRepository,
    cacheService,
  );
  const validator = new RequiredFieldsValidator();
  const registerBeachController = new RegisterBeachController(registerBeachUseCase, validator);

  return registerBeachController;
};
