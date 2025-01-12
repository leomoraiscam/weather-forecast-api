import { StormGlassAPIClient } from '@src/application/services/stormglass/stormglass-api-client';
import { StormGlassService } from '@src/application/services/stormglass/stormglass-service';
import { IGetUserBeachesForecastUseCase } from '@src/application/usecases/beaches/get-user-beaches-forecast/contracts/get-user-beaches-interface';
import { GetUserBeachesForecastUseCase } from '@src/application/usecases/beaches/get-user-beaches-forecast/get-user-beaches-forecast-use-case';
import { BeachRepository } from '@src/infrastructure/database/mongo/repositories/beaches/beach-repository';
import { UserRepository } from '@src/infrastructure/database/mongo/repositories/users/user-repository';
import { RedisCacheProvider } from '@src/infrastructure/providers/cache-provider/redis-cache-provider';
import { AxiosProvider } from '@src/infrastructure/providers/http-provider/axios-provider';
import { PinoLoggerProvider } from '@src/infrastructure/providers/logger-provider/pino-logger-provider';

export const makeGetUserBeachesForecastUseCase = (): IGetUserBeachesForecastUseCase => {
  const cacheProvider = new RedisCacheProvider();
  const loggerProvider = new PinoLoggerProvider();
  const axiosProvider = new AxiosProvider(loggerProvider);
  const stormGlassAPIClient = new StormGlassAPIClient(axiosProvider);
  const stormGlassService = new StormGlassService(cacheProvider, stormGlassAPIClient);
  const usersRepository = new UserRepository();
  const beachesRepository = new BeachRepository();
  const getUserBeachesForecastUseCase = new GetUserBeachesForecastUseCase(
    stormGlassService,
    usersRepository,
    beachesRepository,
    loggerProvider,
  );

  return getUserBeachesForecastUseCase;
};
