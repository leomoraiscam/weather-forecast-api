import { RegisterBeachUseCase } from '@src/application/usecases/beaches/register-beach/register-beach-use-case';
import { BeachRepository } from '@src/infrastructure/database/mongo/repositories/beaches/beach-repository';
import { UserRepository } from '@src/infrastructure/database/mongo/repositories/users/user-repository';
import { RedisCacheProvider } from '@src/infrastructure/providers/cache-provider/redis-cache-provider';
import { IController } from '@src/main/adapters/ports/controller';
import { RegisterBeachController } from '@src/presentation/controllers/register-beach-controller';

export const makeRegisterBeachController = (): IController => {
  const beachRepository = new BeachRepository();
  const userRepository = new UserRepository();
  const cacheService = new RedisCacheProvider();
  const registerBeachUseCase = new RegisterBeachUseCase(
    beachRepository,
    userRepository,
    cacheService,
  );
  const registerBeachController = new RegisterBeachController(registerBeachUseCase);

  return registerBeachController;
};
