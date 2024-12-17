import { IRegisterBeachUseCase } from '@src/application/usecases/beaches/register-beach/contracts/register-beach-interface';
import { RegisterBeachUseCase } from '@src/application/usecases/beaches/register-beach/register-beach-use-case';
import { BeachRepository } from '@src/infrastructure/database/mongo/repositories/beaches/beach-repository';
import { UserRepository } from '@src/infrastructure/database/mongo/repositories/users/user-repository';
import { RedisCacheProvider } from '@src/infrastructure/providers/cache-provider/redis-cache-provider';

export const makeRegisterBeachUseCase = (): IRegisterBeachUseCase => {
  const beachRepository = new BeachRepository();
  const userRepository = new UserRepository();
  const cacheService = new RedisCacheProvider();
  const registerBeachUseCase = new RegisterBeachUseCase(
    beachRepository,
    userRepository,
    cacheService,
  );

  return registerBeachUseCase;
};
